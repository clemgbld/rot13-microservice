import http from "http";

interface StarAsync {
  port: number;
}

export interface HttpServer {
  create: () => HttpServer;
  startAsync: ({ port }: StarAsync) => Promise<unknown>;
  stopAsync: () => Promise<unknown>;
}

export const httpServer = () => {
  let server: http.Server | undefined;
  return {
    create: function () {
      return this;
    },
    startAsync: async ({ port }: StarAsync) =>
      new Promise((resolve, reject) => {
        if (server !== undefined) {
          throw new Error("Server must be closed before being restared");
        }
        server = http.createServer();
        server.on("error", (err) => {
          reject(
            new Error(`Couldn't start server due to error: ${err.message}`)
          );
        });
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
