import { CommandLine } from "../infrastructure/command-line";
import { HttpServer } from "../infrastructure/http-server";

export const app = (commandLine: CommandLine, httpServer: HttpServer) => {
  const runServerAsync = async (server: HttpServer, port: number) => {
    const onRequestAsync = () => ({ status: 200, headers: {}, body: "" });
    // const onRequestAsync = (req, res) => ({
    //   statusCode: 501,
    //   headers: { "Content-Type": "text/plain; charset=utf-8" },
    //   body: "not yet implented",
    // });
    // await server.startAsync({ port,onRequestAsync });
    await server.startAsync({ port, onRequestAsync });
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
