import { CommandLine } from "../infrastructure/command-line";

export const runAsync = (commandLine: CommandLine) => {
  const args = commandLine.args();

  if (args.length !== 2)
    return commandLine.writeOutpout("please provide 2 arguments");

  commandLine.writeOutpout("TODO");
};
