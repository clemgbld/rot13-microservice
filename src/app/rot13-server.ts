import { CommandLine } from "../infrastructure/command-line";
import { HttpServer } from "../infrastructure/http-server";

export const app = (commandLine: CommandLine, httpServer: HttpServer) => {
  const runServerAsync = async (server: HttpServer, port: number) => {
    await server.startAsync({ port });
    commandLine.writeOutpout(`Server started on port ${port}`);
  };
  return {
    startAsync: async () => {
      const input = commandLine.args();
      if (input.length === 0)
        return commandLine.writeOutpout("please provide an argument");
      if (input.length > 1)
        return commandLine.writeOutpout("please provide at most one argument");
      const port = +input[0];
      await runServerAsync(httpServer, port);
    },
  };
};
