import { commandLine, nullProcess } from "../command-line";
describe("command-line nullability", () => {
  it("remembers last output", () => {
    const NullableCommandLine = commandLine(nullProcess());
    NullableCommandLine.writeOutpout("my last output");
    expect(NullableCommandLine.getLastOutpout()).toEqual("my last output\n");
  });

  it("should have a undefined last output when nothing has been writen yet", () => {
    const NullableCommandLine = commandLine(nullProcess());
    expect(NullableCommandLine.getLastOutpout()).toEqual(undefined);
  });

  it("has no arguments by default", () => {
    const NullableCommandLine = commandLine(nullProcess());
    expect(NullableCommandLine.args()).toEqual([]);
  });

  it("should be able to configure arguments", () => {
    const NullableCommandLine = commandLine(nullProcess(["one", "two"]));
    expect(NullableCommandLine.args()).toEqual(["one", "two"]);
  });

  it("emists an event when output occurs", () => {
    const NullableCommandLine = commandLine(nullProcess());
    let lastStdout = "none";
    const off = NullableCommandLine.onStdout((text) => {
      lastStdout = text;
    });

    NullableCommandLine.writeOutpout("A");

    expect(lastStdout).toBe("A\n");
    off();
    NullableCommandLine.writeOutpout("B");
    expect(lastStdout).toBe("A\n");
  });
});
