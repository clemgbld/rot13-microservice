import { commandLine, nullProcess } from "../../infrastructure/command-line";
import { runAsync } from "../rot13-cli";

describe("rot13-cli", () => {
  const setupCommandLine = (args: string[] = ["something1", "something2"]) => {
    const fakeCommandLine = commandLine(nullProcess(args));
    const { outpouts } = fakeCommandLine.trackStdout();
    return { fakeCommandLine, outpouts };
  };

  it("should write todo", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine();

    await runAsync(fakeCommandLine);

    expect(outpouts).toEqual(["TODO\n"]);
  });

  it("should give an error message when the user do not provide  2 arguments", async () => {
    const { fakeCommandLine, outpouts } = setupCommandLine(["something1"]);

    await runAsync(fakeCommandLine);

    expect(outpouts).toEqual(["please provide 2 arguments\n"]);
  });
});
