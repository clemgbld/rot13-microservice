import { httpServer, HttpServer } from "../http-server";

const PORT = 3001;

const startAsync = async (server: HttpServer) =>
  await server.startAsync({ port: PORT });

const stopAsync = async (server: HttpServer) => await server.stopAsync();

const startAndStopAsync = async (server: HttpServer) => {
  await startAsync(server);
  await stopAsync(server);
};

const finallyStartAndStopAsync = async (
  fnAysync: (server: HttpServer) => Promise<unknown> | void
) => {
  const server = httpServer().create();
  await startAsync(server);
  try {
    await fnAysync(server);
  } finally {
    await stopAsync(server);
  }
};

describe("HTTP Server", () => {
  it("says when server is started", async () => {
    const server = httpServer().create();
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
    await finallyStartAndStopAsync(async (_) => {
      const server = httpServer().create();
      await expect(async () => await startAsync(server)).rejects.toThrowError(
        /^Couldn't start server due to error: listen EADDRINUSE:/
      );
    });
  });

  it("starts and stops the server (and should be able to do so multiple times)", async () => {
    const server = httpServer().create();
    await startAndStopAsync(server);
    await startAndStopAsync(server);
  });

  it("fails fast when server is started twice", async () => {
    await finallyStartAndStopAsync(async (server) => {
      await expect(async () => await startAsync(server)).rejects.toThrow(
        "Server must be closed before being restared"
      );
    });
  });

  it("fails fast when server is stopped when it is not running", async () => {
    const server = httpServer().create();
    await expect(async () => await stopAsync(server)).rejects.toThrow(
      "Can't stop server because it is not running"
    );
  });
});
