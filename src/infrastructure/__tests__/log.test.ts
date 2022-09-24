import { log } from "../log";
import { commandLine, nullProcess } from "../command-line";
import { clock } from "../clock";

describe("log", () => {
  const createLogger = () => {
    const fakeCommandLine = commandLine(nullProcess());
    const fakeClock = clock.createNull({ now: 0 });
    const { outpouts } = fakeCommandLine.trackStdout();
    const logger = log(fakeCommandLine, fakeClock);

    return { logger, outpouts };
  };

  it("outputs current time ", () => {
    const { logger, outpouts } = createLogger();
    const data: Record<string, string> = {
      output: "my output",
    };

    const expectedData = {
      alert: "info",
      output: "my output",
    };
    logger.info(data);
    expect(outpouts).toEqual([
      `Jan 1, 1970, 00:00:00 UTC ${JSON.stringify(expectedData)}\n`,
    ]);
  });

  it("outpouts the full stack trace for the erros", () => {
    const { logger, outpouts } = createLogger();

    const data: Record<string, Error> = {
      output: new Error("my error"),
    };

    logger.info(data);

    expect(outpouts[0]).toMatch(
      /Jan 1, 1970, 00:00:00 UTC {"alert":"info","output":"Error: my error\\n    at/
    );
  });
});
