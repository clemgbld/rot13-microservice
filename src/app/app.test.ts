import { app } from "./app";
import { commandLine, nullProcess } from "../infrastructure/command-line";

describe("app", () => {
  const SUTBuilder = () => ({
    excuteCommandLineWith: (argsOutpout: string[]) => {
      const nullableCommandLine = commandLine(nullProcess(argsOutpout));
      app.run(nullableCommandLine);
      return {
        expectCommanLineToPrint: (expectedOutput: string) =>
          expect(nullableCommandLine.getLastOutpout()).toEqual(
            `${expectedOutput}\n`
          ),
      };
    },
  });

  it("read command line arguments transform it with rot13 and write result", () => {
    const { expectCommanLineToPrint } = SUTBuilder().excuteCommandLineWith([
      "my input",
    ]);
    expectCommanLineToPrint("zl vachg");
  });

  it("writes please provide a string to the command line when no argument provided", () => {
    const { expectCommanLineToPrint } = SUTBuilder().excuteCommandLineWith([]);
    expectCommanLineToPrint("please provide a string");
  });

  it("complains when too many arguments are provided ", () => {
    const { expectCommanLineToPrint } = SUTBuilder().excuteCommandLineWith([
      "a",
      "b",
    ]);
    expectCommanLineToPrint("too many arguments");
  });
});
