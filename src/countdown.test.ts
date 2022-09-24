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
    countdownAsync(text, nullCommandLine, fakeClock);
    expect(nullCommandLine.getLastOutpout()).toBe("3\n");
    await advanceOneSecondAsync(fakeClock);
    expect(nullCommandLine.getLastOutpout()).toBe("2\n");

    let outputs: string[] = [];

    nullCommandLine.onStdout((text) => {
      outputs = [...outputs, text];
    });

    await advanceOneSecondAsync(fakeClock);

    expect(outputs).toEqual(["1\n", "31 груд. 1969 р., 19:00\n"]);
  });
});
