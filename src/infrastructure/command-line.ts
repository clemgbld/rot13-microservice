interface NullProcess {
  stdout: {
    write: (text: string) => void;
  };
  argv: string[];
}

export const nullProcess = (args: string[] = []): NullProcess => ({
  stdout: {
    write: (text: string): void => {},
  },

  argv: ["null_process_node", "null_process_script.js", ...args],
});

export const commandLine = (process: NodeJS.Process | NullProcess) => {
  let lastOutpout: string;
  return {
    writeOutpout: (text: string): void => {
      const outpout = `${text}\n`;
      process.stdout.write(outpout);
      lastOutpout = outpout;
    },
    args: () => process.argv.slice(2),

    getLastOutpout: () => lastOutpout,
  };
};
