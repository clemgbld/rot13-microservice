import { app } from "./app";

describe("App", () => {
  const SUTBuilder = () => ({
    excuteCommandLineWith: (argsOutpout: string[]) => {
      const writeOutpout = jest.fn();
      const commandLine = { writeOutpout, args: () => argsOutpout };
      app.run(commandLine);
      return { writeOutpout };
    },
  });

  it("read command line arguments transform it with rot13 and write result", () => {
    const { writeOutpout } = SUTBuilder().excuteCommandLineWith(["my input"]);
    expect(writeOutpout).toHaveBeenCalledWith("zl vachg");
  });

  it("writes please provide a string to the command line when no argument provided", () => {
    const { writeOutpout } = SUTBuilder().excuteCommandLineWith([]);
    expect(writeOutpout).toHaveBeenCalledWith("please provide a string");
  });

  it("should complains when too many arguments are provided ", () => {
    const { writeOutpout } = SUTBuilder().excuteCommandLineWith(["a", "b"]);
    expect(writeOutpout).toHaveBeenCalledWith("too many arguments");
  });
});
