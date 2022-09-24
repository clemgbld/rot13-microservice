import { CommandLine } from "./command-line";
import { Clock } from "./clock";

export const log = (commandLine: CommandLine, clock: Clock) => ({
  info: (data: Record<string, string>) => {
    const options: Record<string, string | boolean> = {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "long",
      hourCycle: "h23",
    };
    const time = clock.toFormattedString(options, "en-US");
    commandLine.writeOutpout(`${time} ${JSON.stringify(data)}`);
  },
});
