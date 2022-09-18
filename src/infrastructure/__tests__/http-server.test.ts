import http from "http";
import { httpServer, HttpServer, OnRequestAsync } from "../http-server";
import { DependancyHttpRequest, httpRequest } from "../http-request";
const PORT = 5536;

const startAsync = async (
  server: HttpServer,
  onRequestAsync: OnRequestAsync = () => ({
    status: 200,
    headers: {},
    body: "",
  })
) => await server.startAsync({ port: PORT, onRequestAsync });

const stopAsync = async (server: HttpServer) => await server.stopAsync();

const startAndStopAsync = async (server: HttpServer) => {
  await startAsync(server);
  await stopAsync(server);
};

const finallyStartAndStopAsync = async (
  options: OnRequestAsync,
  fnAysync: (server: HttpServer) => any
) => {
  const server = httpServer.create();
  await startAsync(server, options);
  try {
    return await fnAysync(server);
  } finally {
    await stopAsync(server);
  }
};

const getAsync = async ({ onRequestAsync }: { onRequestAsync: any }) =>
  await finallyStartAndStopAsync(onRequestAsync, async () => {
    return await new Promise((resolve, reject) => {
      const request = http.get({ port: PORT });
      request.on("response", (response) => {
        let body = "";
        response.on("data", (data) => {
          body += data;
        });
        response.on("error", (err) => reject(err));
        response.on("end", () => {
          const headers = response.headers;

          delete headers.connection;
          delete headers["content-length"];
          delete headers.date;

          resolve({
            status: response.statusCode,
            body,
            headers: headers,
          });
        });
      });
    });
  });

describe("HTTP Server", () => {
  it("says when server is started", async () => {
    const server = httpServer.create();
    expect(server.isStarted()).toBe(false);
    await startAsync(server);
    try {
      expect(server.isStarted()).toBe(true);
    } finally {
      await stopAsync(server);
      expect(server.isStarted()).toBe(false);
    }
  });

  it("fails gracefully when server has startup error", async () => {
    await finallyStartAndStopAsync(
      () => ({ status: 200, headers: {}, body: "" }),
      async (_) => {
        const server = httpServer.create();
        await expect(async () => await startAsync(server)).rejects.toThrowError(
          /^Couldn't start server due to error: listen EADDRINUSE:/
        );
      }
    );
  });

  it("starts and stops the server (and should be able to do so multiple times)", async () => {
    const server = httpServer.create();
    await startAndStopAsync(server);
    await startAndStopAsync(server);
  });

  it("fails fast when server is started twice", async () => {
    await finallyStartAndStopAsync(
      () => ({ status: 200, headers: {}, body: "" }),
      async (server) => {
        await expect(async () => await startAsync(server)).rejects.toThrow(
          "Server must be closed before being restared"
        );
      }
    );
  });

  describe("requests and responses", () => {
    it("runs a function when a request is received and serves the results", async () => {
      const expectedResponse = {
        status: 777,
        body: "my-body",
        headers: {
          header1: "value1",
          header2: "value2",
        },
      };

      const onRequestAsync = (request: DependancyHttpRequest) => {
        return expectedResponse;
      };
      const response = await getAsync({ onRequestAsync });

      expect(response).toEqual(expectedResponse);
    });

    it("simulates request", async () => {
      const expectedResponse = {
        status: 777,
        body: "my-body",
        headers: {
          header1: "value1",
          header2: "value2",
        },
      };

      const expectedRequest = httpRequest.createNull();
      var actualRequest: DependancyHttpRequest | undefined;
      const onRequestAsync = (request: DependancyHttpRequest) => {
        actualRequest = request;
        return expectedResponse;
      };
      const server = httpServer.createNull();
      await startAsync(server, onRequestAsync);
      const response = await server.simulateRequest(expectedRequest);
      expect(response).toEqual(expectedResponse);
      expect(actualRequest).toEqual(expectedRequest);
    });

    it("fails fast when we simulate the request before starting the null server", async () => {
      const server = httpServer.createNull();
      expect(() => server.simulateRequest()).rejects.toThrow(
        "Could not simulate the request before starting the server"
      );
    });

    it("fails gracefully when request handler throw exception", async () => {
      const onRequestAsync = () => {
        throw new Error("onRequestAsync error");
      };
      const response = await getAsync({ onRequestAsync });

      expect(response).toEqual({
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
        body: "Internal Server Error: request handler threw exception",
      });
    });
  });

  it("fails fast when server is stopped when it is not running", async () => {
    const server = httpServer.create();
    await expect(async () => await stopAsync(server)).rejects.toThrow(
      "Can't stop server because it is not running"
    );
  });
});

describe("nullability", () => {
  it("does not actually start or stop the server", async () => {
    const server = httpServer.createNull();
    const server2 = httpServer.createNull();
    await startAsync(server);
    expect(async () => await startAsync(server2)).not.toThrow();
    await stopAsync(server);
  });
});
