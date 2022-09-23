import { commandLine, nullProcess } from "../../infrastructure/command-line";
import { clock } from "../../infrastructure/clock";
import { go } from "../clock-exemple";

describe("clock exemple", () => {
  it("writes current time ", () => {
    const fakeCommandLine = commandLine(nullProcess());
    const fakeClock = clock.createNull({ now: 46800000 });
    go(fakeCommandLine, fakeClock);

    expect(fakeCommandLine.getLastOutpout()).toBe(
      "Jan 1, 1970, 13:00:00 UTC\n"
    );
  });
});
