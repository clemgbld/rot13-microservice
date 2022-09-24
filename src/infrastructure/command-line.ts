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

  trackStdout: () => {
    outpouts: string[];
    turnOffTracking: () => void;
    consume: () => string[];
  };
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
  const emitter = new EventEmitter();
  const onStdout = (fn: (str: string) => void) => {
    emitter.on(STDOUT_EVENT, fn);
    return () => emitter.off(STDOUT_EVENT, fn);
  };
  return {
    writeOutpout: (text: string): void => {
      const outpout = `${text}\n`;
      process.stdout.write(outpout);
      emitter.emit(STDOUT_EVENT, outpout);
    },
    args: () => process.argv.slice(2),

    trackStdout: () => {
      let outpouts: string[] = [];

      const off = onStdout((text: string) => {
        outpouts.push(text);
      });

      const consume = () => {
        let result = [...outpouts];

        outpouts.length = 0;

        return result;
      };
      const turnOffTracking = () => {
        consume();
        off();
      };

      return { outpouts, turnOffTracking, consume };
    },
  };
};
