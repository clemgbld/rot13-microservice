import { commandLine, nullProcess } from "../../infrastructure/command-line";
import { httpServer } from "../../infrastructure/http-server";
import { httpRequest } from "../../infrastructure/http-request";
import { rot13 } from "../../core/rot13";
import { app } from "../rot13-server";

const startServerAsync = async (args: string[] = ["5000"]) => {
  const nullCommandLine = commandLine(nullProcess(args));
  const nullHttpServer = httpServer.createNull();
  const myApp = app(nullCommandLine, nullHttpServer);
  await myApp.startAsync();

  return { nullCommandLine, nullHttpServer };
};

describe("ROT13-Server", () => {
  it("starts the server", async () => {
    const { nullCommandLine, nullHttpServer } = await startServerAsync([
      "5000",
    ]);
    expect(nullHttpServer.isStarted()).toBe(true);
    expect(nullCommandLine.getLastOutpout()).toBe(
      "Server started on port 5000\n"
    );
  });

  it("transforms request", async () => {
    const { nullCommandLine, nullHttpServer } = await startServerAsync();
    const request = httpRequest.createNull({ body: "hello" });
    const response = await nullHttpServer.simulateRequest(request);
    expect(nullCommandLine.getLastOutpout()).toBe("Recevied request\n");
    expect(response).toEqual({
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: rot13("hello"),
    });
  });

  describe("Command-line processing", () => {
    it("should tell the user to provide an argument when the user do not", async () => {
      const { nullCommandLine } = await startServerAsync([]);
      expect(nullCommandLine.getLastOutpout()).toBe(
        "please provide an argument\n"
      );
    });

    it("should tell the user when he provide tto much argument", async () => {
      const { nullCommandLine } = await startServerAsync(["one", "two"]);
      expect(nullCommandLine.getLastOutpout()).toBe(
        "please provide at most one argument\n"
      );
    });
  });
});
