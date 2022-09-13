import EventEmitter from "events";
import http from "http";
import { pipe } from "ramda";
import { withConstructor } from "../utils/withConstructor";

interface StarAsync {
  port: number;
}

export interface HttpServer {
  isStarted: () => boolean;
  startAsync: ({ port }: StarAsync) => Promise<unknown>;
  stopAsync: () => Promise<unknown>;
}

const withHttpServer = (http: any) => (o: any) => {
  let server: any | undefined;
  return {
    ...o,
    isStarted: () => server !== undefined,
    startAsync: async ({ port }: StarAsync) =>
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
            nodeRequest: http.RequestOptions,
            nodeResponse: http.ServerResponse
          ) => {
            console.log("RECEIVED");
            nodeResponse.end("node response");
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

export const httpServer = {
  create: () => pipe(withHttpServer(http), withConstructor(httpServer))({}),
  createNull: () =>
    pipe(withHttpServer(nullHttp), withConstructor(httpServer))({}),
};
