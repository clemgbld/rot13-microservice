import { commandLine, nullProcess } from "../command-line";
describe("command-line nullability", () => {
  it("has no arguments by default", () => {
    const NullableCommandLine = commandLine(nullProcess());
    expect(NullableCommandLine.args()).toEqual([]);
  });

  it("should be able to configure arguments", () => {
    const NullableCommandLine = commandLine(nullProcess(["one", "two"]));
    expect(NullableCommandLine.args()).toEqual(["one", "two"]);
  });

  it("tracks write to sdout and turn off tracking as well", () => {
    const NullableCommandLine = commandLine(nullProcess());
    const { outpouts, turnOffTracking } = NullableCommandLine.trackStdout();
    NullableCommandLine.writeOutpout("A");
    expect(outpouts).toEqual(["A\n"]);
    NullableCommandLine.writeOutpout("B");
    turnOffTracking();
    expect(outpouts).toEqual([]);
  });

  it("allows output to be consume", () => {
    const NullableCommandLine = commandLine(nullProcess());
    const { consume } = NullableCommandLine.trackStdout();
    NullableCommandLine.writeOutpout("A");
    expect(consume()).toEqual(["A\n"]);
    NullableCommandLine.writeOutpout("B");
    expect(consume()).toEqual(["B\n"]);
  });
});
