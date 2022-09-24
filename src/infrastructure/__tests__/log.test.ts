import { log } from "../log";
import { commandLine, nullProcess } from "../command-line";
import { clock } from "../clock";

describe("log", () => {
  it("outputs current time ", () => {
    const fakeCommandLine = commandLine(nullProcess());
    const fakeClock = clock.createNull({ now: 0 });
    const { outpouts } = fakeCommandLine.trackStdout();
    const logger = log(fakeCommandLine, fakeClock);
    logger.info();
    expect(outpouts).toEqual(["Jan 1, 1970, 00:00:00 UTC\n"]);
  });
});
