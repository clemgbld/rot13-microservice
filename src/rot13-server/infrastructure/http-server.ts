import EventEmitter from "events";
import http from "http";
import { httpRequest } from "./http-request";
import { buildInfrastructure } from "../../infrastructure/utils/buildInfrastructure";
import { RequestAdapter } from "./http-request";

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

export interface Response {
  status: number;
  body: string;
  headers: Record<string, string>;
}

export type OnRequestAsync = (request: RequestAdapter) => Promise<Response>;

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

const handleRequestAsync = async (
  request: RequestAdapter,
  onRequestAsync: OnRequestAsync,
  log: any
) => {
  try {
    const response = await onRequestAsync(request);
    return response;
  } catch (error) {
    log.emergency({
      message: "request handler threw exception",
      error,
    });
    return {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: "Internal Server Error: request handler threw exception",
    };
  }
};

interface DependancyHttpServer {
  http: DependancyHttp;
  log?: any;
}

const withHttpServer =
  ({ http, log }: DependancyHttpServer) =>
  (o: any) => {
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
            async (
              nodeRequest: http.IncomingMessage,
              nodeResponse: http.ServerResponse
            ) => {
              const {
                status = 501,
                body = "",
                headers = {},
              } = await handleRequestAsync(
                httpRequest.create(nodeRequest),
                onRequestAsync,
                log
              );
              nodeResponse.statusCode = status;
              Object.entries(headers).forEach(([name, value = ""]) =>
                nodeResponse.setHeader(name, value)
              );
              nodeResponse.end(body);
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
      simulateRequest: async (
        request: RequestAdapter = httpRequest.createNull()
      ) => {
        if (!fakeOnRequestAsync) {
          throw new Error(
            "Could not simulate the request before starting the server"
          );
        }
        return handleRequestAsync(request, fakeOnRequestAsync, log);
      },
    };
  };

export const httpServer = {
  create: (log: any) =>
    buildInfrastructure({
      dependancy: { http, log },
      infrastructureObj: httpServer,
      withMixin: withHttpServer,
    }),
  createNull: (log: any) =>
    buildInfrastructure({
      dependancy: { http: nullHttp, log },
      infrastructureObj: httpServer,
      withMixin: withHttpServer,
    }),
};
