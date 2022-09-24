import { CommandLine } from "./command-line";
import { Clock } from "./clock";

const transformErrorinStackTrace = (data: Record<string, string | Error>) =>
  Object.entries(data).reduce(
    (acc: Record<string, string | undefined>, [key, value]) => ({
      ...acc,
      [key]: value instanceof Error ? value.stack : value,
    }),
    {}
  );

export const log = (commandLine: CommandLine, clock: Clock) => ({
  info: (data: Record<string, string | Error>) => {
    const options: Record<string, string | boolean> = {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "long",
      hourCycle: "h23",
    };
    const time = clock.toFormattedString(options, "en-US");
    commandLine.writeOutpout(
      `${time} ${JSON.stringify({
        alert: "info",
        ...transformErrorinStackTrace(data),
      })}`
    );
  },
});
