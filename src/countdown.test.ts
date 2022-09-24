import { countdownAsync } from "./countdown";
import { commandLine, nullProcess } from "./infrastructure/command-line";
import { clock, Clock } from "./infrastructure/clock";

describe("countdown", () => {
  const advanceOneSecondAsync = async (clock: Clock) =>
    await clock.advanceNullAsync(1000);

  it("writes one lines at a time, waiting one seconds after each line", async () => {
    const text = ["3", "2", "1"];
    const nullCommandLine = commandLine(nullProcess());
    const fakeClock = clock.createNull({
      now: 0,
      locale: "uk",
      timeZone: "America/New_York",
    });

    const { outpouts, consume } = nullCommandLine.trackStdout();
    countdownAsync(text, nullCommandLine, fakeClock);
    expect(consume()).toEqual(["3\n"]);
    await advanceOneSecondAsync(fakeClock);
    expect(consume()).toEqual(["2\n"]);
    await advanceOneSecondAsync(fakeClock);
    expect(outpouts).toEqual(["1\n", "31 груд. 1969 р., 19:00\n"]);
  });
});
