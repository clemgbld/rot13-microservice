import { CommandLine } from "./infrastructure/command-line";
import { Clock } from "./infrastructure/clock";

export const countdownAsync = async (
  textArr: string[],
  commandLine: CommandLine,
  clock: Clock
) => {
  for (let i = 0; i < textArr.length; i++) {
    commandLine.writeOutpout(textArr[i]);
    if (i < textArr.length - 1) await clock.waitAsync(1000);
  }
  commandLine.writeOutpout(
    clock.toFormattedString({
      dateStyle: "medium",
      timeStyle: "short",
    })
  );
};
