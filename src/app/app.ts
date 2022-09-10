import { rot13 } from "../core/rot13";

interface CommandLine {
  writeOutpout: (text: string) => void;
  args: () => string[];
}

export const app = {
  run: (commandLine: CommandLine) => {
    const input = commandLine.args();
    if (input.length > 1) return commandLine.writeOutpout("too many arguments");
    if (input.length === 0)
      return commandLine.writeOutpout("please provide a string");
    const output = rot13(input[0]);
    commandLine.writeOutpout(output);
  },
};
