import { CommandLine } from "../infrastructure/command-line";

export const runAsync = async (commandLine: CommandLine) => {
  const args = commandLine.args();

  if (args.length !== 2)
    return commandLine.writeOutpout("please provide 2 arguments");

  commandLine.writeOutpout("TODO");
};

// export const runAsync = async (commandLine: CommandLine, rot13Client) => {
//   const args = commandLine.args();

//   if (args.length !== 2)
//     return commandLine.writeOutpout("please provide 2 arguments");

//   const [port, text] = args;

//   const response = await rot13Client.transformAsync(port, text);

//   commandLine.writeOutpout(response);

//   commandLine.writeOutpout("TODO");
// };
