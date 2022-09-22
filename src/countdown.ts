import { CommandLine } from "./infrastructure/command-line";
import { Clock } from "./infrastructure/clock";

export const countdownAsync = async (
  textArr: string[],
  commandLine: CommandLine,
  clock: Clock
) => {
  for (let text of textArr) {
    commandLine.writeOutpout(text);
    await clock.waitAsync(1000);
  }
};
