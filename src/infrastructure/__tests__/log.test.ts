import { log } from "../log";
import { commandLine, nullProcess } from "../command-line";
import { clock } from "../clock";

describe("log", () => {
  it("outputs current time ", () => {
    const fakeCommandLine = commandLine(nullProcess());
    const fakeClock = clock.createNull();
    const logger = log(fakeCommandLine, fakeClock);

    logger.info();
  });
});
