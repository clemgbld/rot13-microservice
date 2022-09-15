import EventEmitter from "events";
import http from "http";
import { pipe } from "ramda";
import { withConstructor } from "../utils/withConstructor";

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

export type OnRequestAsync = () => Response;

interface StarAsync {
  port: number;
  onRequestAsync: OnRequestAsync;
}

export interface HttpServer {
  isStarted: () => boolean;
  startAsync: ({ port }: StarAsync) => Promise<unknown>;
  stopAsync: () => Promise<unknown>;
}

type Dependancyhttp = typeof http | typeof nullHttp;

interface HttpServerObj {
  create: () => any;
  createNull: () => any;
}

const handleRequestAsync = (onRequestAsync: OnRequestAsync) => {
  try {
    return onRequestAsync();
  } catch (err) {
    return {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: "Internal Server Error: request handler threw exception",
    };
  }
};

const withHttpServer = (http: Dependancyhttp) => (o: any) => {
  let server: http.Server | NullNodeServer | undefined;
  return {
    ...o,
    isStarted: () => server !== undefined,
    startAsync: async ({ port, onRequestAsync }: StarAsync) =>
      new Promise((resolve, reject) => {
        if (server !== undefined) {
          throw new Error("Server must be closed before being restared");
        }
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
            const { status, body, headers } =
              handleRequestAsync(onRequestAsync);
            nodeResponse.statusCode = status;
            Object.entries(headers).forEach(([name, value]) =>
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
  };
};

const buildServer = (
  dependancyhttp: Dependancyhttp,
  httpServerObj: HttpServerObj
) => pipe(withHttpServer(dependancyhttp), withConstructor(httpServerObj))({});

export const httpServer = {
  create: () => buildServer(http, httpServer),
  createNull: () => buildServer(nullHttp, httpServer),
};
