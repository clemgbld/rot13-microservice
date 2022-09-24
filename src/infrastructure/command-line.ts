import EventEmitter from "events";

const STDOUT_EVENT = "stdout";

interface NullProcess {
  stdout: {
    write: (text: string) => void;
  };
  argv: string[];
}

export interface CommandLine {
  writeOutpout: (text: string) => void;
  args: () => string[];
  getLastOutpout: () => string;
  onStdout: (fn: (str: string) => void) => () => void;
}

export const nullProcess = (args: string[] = []): NullProcess => ({
  stdout: {
    write: (text: string): void => {},
  },
  argv: ["null_process_node", "null_process_script.js", ...args],
});

export const commandLine = (
  process: NodeJS.Process | NullProcess
): CommandLine => {
  let lastOutpout: string;
  const emitter = new EventEmitter();
  return {
    writeOutpout: (text: string): void => {
      const outpout = `${text}\n`;
      process.stdout.write(outpout);
      lastOutpout = outpout;
      emitter.emit(STDOUT_EVENT, outpout);
    },
    args: () => process.argv.slice(2),

    getLastOutpout: () => lastOutpout,

    onStdout: (fn: (str: string) => void) => {
      emitter.on(STDOUT_EVENT, fn);

      return () => {
        emitter.off(STDOUT_EVENT, fn);
      };
    },
  };
};
