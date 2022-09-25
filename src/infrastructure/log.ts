import EventEmitter from "events";
import { pipe } from "ramda";
import { CommandLine } from "./command-line";
import { Clock } from "./clock";
import { trackOutput } from "./utils/trackOutput";

const OUTPUT_EVENT = "OUTPUT_EVENT";

const stringElseStack = (value: string | Error | undefined) =>
  value instanceof Error ? value.stack : value;

const transformErrorinStackTrace = (
  data: Record<string, string | Error | undefined>
) =>
  Object.entries(data).reduce(
    (acc: Record<string, string | undefined>, [key, value]) => ({
      ...acc,
      [key]: stringElseStack(value),
    }),
    {}
  );

const addAlert =
  (type: string) => (data: Record<string, string | undefined | Error>) => ({
    alert: type,
    ...data,
  });

type Logs = Record<
  string,
  (data: Record<string, string | undefined | Error>) => void
>;

export const log = (commandLine: CommandLine, clock: Clock): any => {
  const emitter = new EventEmitter();
  const options: Record<string, string | boolean> = {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "long",
    hourCycle: "h23",
  };

  const doLog =
    (
      addAlertFn: (data: Record<string, string | undefined | Error>) => {
        alert: string;
      }
    ) =>
    (data: Record<string, string | undefined | Error>) => {
      const time = clock.toFormattedString(options, "en-US");
      const formatLog = pipe(transformErrorinStackTrace, addAlertFn);
      commandLine.writeOutpout(`${time} ${JSON.stringify(formatLog(data))}`);
      emitter.emit(OUTPUT_EVENT, addAlertFn(data));
    };
  const ALERTS_LEVELS = ["info", "debug", "monitor", "action", "emergency"];

  const buildLogs = () =>
    ALERTS_LEVELS.reduce(
      (logs: Logs, logStr) => ({ ...logs, [logStr]: doLog(addAlert(logStr)) }),
      {}
    );

  return {
    ...buildLogs(),
    trackOutput: () => trackOutput(emitter, OUTPUT_EVENT),
  };
};
