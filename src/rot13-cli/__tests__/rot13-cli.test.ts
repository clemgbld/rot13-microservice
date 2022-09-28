import { commandLine, nullProcess } from "../../infrastructure/command-line";
import { runAsync } from "../rot13-cli";
import { createClient } from "../infrastructure/__tests__/rot13-client.test";
import { createRot13Client } from "../infrastructure/rot13-client";
describe("rot13-cli", () => {
  const setupCommandLine = (args: string[] = ["9999", "valid-body"]) => {
    const fakeCommandLine = commandLine(nullProcess(args));
    const { outpouts } = fakeCommandLine.trackStdout();
    return { fakeCommandLine, outpouts };
  };

  const createFakeRot13Client = ({
    status = 200,
    headers = { "content-type": "application/json" },
    body = JSON.stringify({ transformed: "Null response" }),
  }: {
    status?: number;
    headers?: Record<string, string>;
    body?: string;
  } = {}) => {
    const { client } = createClient({ status, headers, body });
    return createRot13Client(client);
  };

  it("calls ROT-13 service", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine();

    const rot13Client = createFakeRot13Client();
    await runAsync(fakeCommandLine, rot13Client);

    expect(outpouts).toEqual(["Null response\n"]);
  });

  it("should give an error message when the user do not provide  2 arguments", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine(["first-argument"]);

    const rot13Client = createFakeRot13Client();
    await runAsync(fakeCommandLine, rot13Client);

    expect(outpouts).toEqual(["please provide 2 arguments\n"]);
  });

  it("should give an error message when the port that the user enter is not a valid one", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine([
      "unvalid-port",
      "valid-body",
    ]);

    const rot13Client = createFakeRot13Client();
    await runAsync(fakeCommandLine, rot13Client);
    expect(outpouts).toEqual([
      "please provide a valid port as first argument\n",
    ]);
  });

  it("should output an error when rot13 service fail", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine();

    const rot13Client = createFakeRot13Client({ status: 400 });
    await runAsync(fakeCommandLine, rot13Client);

    expect(outpouts).toEqual([
      `Unexpected status from ROT 13 service\nHost:localhost:9999\nStatus: 400\nHeaders: ${JSON.stringify(
        {
          "content-type": "application/json",
        }
      )}\nBody: ${JSON.stringify({ transformed: "Null response" })}\n`,
    ]);
  });
});
