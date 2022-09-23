import { CommandLine } from "../infrastructure/command-line";
import { Clock } from "../infrastructure/clock";

export const go = (commandLine: CommandLine, clock: Clock) => {
  const format: Record<string, string | boolean | undefined> = {
    dateStyle: "medium",
    timeStyle: "long",
    hour12: false,
    timeZone: undefined,
  };

  const time = clock.toFormattedString(format, "en-US");
  commandLine.writeOutpout(time);
};
