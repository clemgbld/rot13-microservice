import { commandLine, nullProcess } from "../../infrastructure/command-line";
import { runAsync } from "../rot13-cli";
import { createClient } from "../infrastructure/__tests__/rot13-client.test";
import { createRot13Client } from "../infrastructure/rot13-client";
import { clock } from "../../infrastructure/clock";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAResolvedPromise: () => Promise<{
        pass: true;
        message: () => string;
      }>;
    }
  }
}

const TIMEOUT_TIME = 5000;

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
    hang = false,
  }: {
    status?: number;
    headers?: Record<string, string>;
    body?: string;
    hang?: boolean;
  } = {}) => {
    const { client } = createClient({ status, headers, body, hang });
    return createRot13Client(client);
  };

  it("calls ROT-13 service", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine();
    const fakeClock = clock.createNull({ now: 0 });

    const rot13Client = createFakeRot13Client();
    await runAsync(fakeCommandLine, rot13Client, fakeClock);

    expect(outpouts).toEqual(["Null response\n"]);
  });

  it("should give an error message when the user do not provide  2 arguments", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine(["first-argument"]);

    const fakeClock = clock.createNull({ now: 0 });

    const rot13Client = createFakeRot13Client();
    await runAsync(fakeCommandLine, rot13Client, fakeClock);

    expect(outpouts).toEqual(["please provide 2 arguments\n"]);
  });

  it("should give an error message when the port that the user enter is not a valid one", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine([
      "unvalid-port",
      "valid-body",
    ]);

    const fakeClock = clock.createNull({ now: 0 });

    const rot13Client = createFakeRot13Client();
    await runAsync(fakeCommandLine, rot13Client, fakeClock);
    expect(outpouts).toEqual([
      "please provide a valid port as first argument\n",
    ]);
  });

  it("should output an error when rot13 service fail", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine();

    const fakeClock = clock.createNull({ now: 0 });

    const rot13Client = createFakeRot13Client({ status: 400 });
    await runAsync(fakeCommandLine, rot13Client, fakeClock);

    expect(outpouts).toEqual([
      `Unexpected status from ROT 13 service\nHost:localhost:9999\nStatus: 400\nHeaders: ${JSON.stringify(
        {
          "content-type": "application/json",
        }
      )}\nBody: ${JSON.stringify({ transformed: "Null response" })}\n`,
    ]);
  });

  it("timesout rot13 client when Rot13 client respond too slowly", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine();
    const fakeClock = clock.createNull({ now: 0 });
    const rot13Client = createFakeRot13Client({ status: 200, hang: true });
    const { outpouts: requests } = rot13Client.trackRequests();
    const runPromise = runAsync(fakeCommandLine, rot13Client, fakeClock);
    fakeClock.advanceNullAsync(TIMEOUT_TIME);

    await expect(runPromise).toBeAResolvedPromise();
    expect(requests).toEqual([
      { port: 9999, text: "valid-body" },
      { port: 9999, text: "valid-body", cancelled: true },
    ]);
    expect(outpouts).toEqual(["Rot13 service failed due to a timeout\n"]);
  });
});
