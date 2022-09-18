import EventEmitter from "events";
import http from "http";
import { httpRequest } from "./http-request";
import { buildInfrastructure } from "./utils/buildInfrastructure";

class NullNodeServer extends EventEmitter {
  constructor() {
    super();
  }
  listen() {
    setImmediate(() => this.emit("listening"));
  }

  close() {
    setImmediate(() => this.emit("close"));
  }
}

const nullHttp = {
  createServer: () => new NullNodeServer(),
};

interface Response {
  status: number;
  body: string;
  headers: Record<string, string>;
}

export type OnRequestAsync = (request: any) => Response;

interface StarAsync {
  port: number;
  onRequestAsync: OnRequestAsync;
}

export interface HttpServer {
  isStarted: () => boolean;
  startAsync: ({ port }: StarAsync) => Promise<unknown>;
  stopAsync: () => Promise<unknown>;
}

export type DependancyHttp = typeof http | typeof nullHttp;

const handleRequestAsync = (
  request: http.IncomingMessage | null | {} | undefined,
  onRequestAsync: OnRequestAsync
) => {
  try {
    return onRequestAsync(request);
  } catch (err) {
    return {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: "Internal Server Error: request handler threw exception",
    };
  }
};

const withHttpServer = (http: DependancyHttp) => (o: any) => {
  let fakeOnRequestAsync: undefined | OnRequestAsync;
  let server: http.Server | NullNodeServer | undefined;
  return {
    ...o,
    isStarted: () => server !== undefined,
    startAsync: async ({ port, onRequestAsync }: StarAsync) =>
      new Promise((resolve, reject) => {
        if (server !== undefined) {
          throw new Error("Server must be closed before being restared");
        }
        fakeOnRequestAsync = onRequestAsync;
        server = http.createServer();
        server.on("error", (err: any) => {
          reject(
            new Error(`Couldn't start server due to error: ${err.message}`)
          );
        });
        server.on(
          "request",
          (
            nodeRequest: http.IncomingMessage,
            nodeResponse: http.ServerResponse
          ) => {
            const { status, body, headers } = handleRequestAsync(
              httpRequest.create(nodeRequest),
              onRequestAsync
            );
            nodeResponse.statusCode = status || 200;
            Object.entries(headers || {}).forEach(([name, value]) =>
              nodeResponse.setHeader(name, value)
            );
            nodeResponse.end(body || "");
          }
        );
        server.on("listening", resolve);
        server.listen(port);
      }),
    stopAsync: async () =>
      new Promise((resolve) => {
        if (!server) {
          throw new Error("Can't stop server because it is not running");
        }

        server.on("close", resolve);
        server.close();
        server = undefined;
      }),
    simulateRequest: async () => {
      if (!fakeOnRequestAsync) {
        throw new Error(
          "Could not simulate the request before starting the server"
        );
      }
      return handleRequestAsync({}, fakeOnRequestAsync);
    },
  };
};

export const httpServer = {
  create: () =>
    buildInfrastructure({
      dependancy: http,
      infrastructureObj: httpServer,
      withMixin: withHttpServer,
    }),
  createNull: () =>
    buildInfrastructure({
      dependancy: nullHttp,
      infrastructureObj: httpServer,
      withMixin: withHttpServer,
    }),
};
