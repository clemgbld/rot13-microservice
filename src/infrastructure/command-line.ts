import EventEmitter from "events";
import { trackOutput, Output } from "./utils/trackOutput";

const STDOUT_EVENT = "stdout";

interface NullProcess {
  stdout: {
    write: (text: string | Record<string, string>) => void;
  };
  argv: string[];
}

export interface CommandLine {
  writeOutpout: (text: string) => void;
  args: () => string[];

  trackStdout: () => {
    outpouts: Output[];
    turnOffTracking: () => void;
    consume: () => Output[];
  };
}

export const nullProcess = (args: string[] = []): NullProcess => ({
  stdout: {
    write: (text: string | Record<string, string>): void => {},
  },
  argv: ["null_process_node", "null_process_script.js", ...args],
});

export const commandLine = (
  process: NodeJS.Process | NullProcess
): CommandLine => {
  const emitter = new EventEmitter();
  return {
    writeOutpout: (text: string): void => {
      const outpout = `${text}\n`;
      process.stdout.write(outpout);
      emitter.emit(STDOUT_EVENT, outpout);
    },
    args: () => process.argv.slice(2),

    trackStdout: () => trackOutput(emitter, STDOUT_EVENT),
  };
};
