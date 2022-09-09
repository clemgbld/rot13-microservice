import { writeOutput } from "../command-line";
import childProcess from "child_process";

describe("commandLine", () => {
  it("writes output", (done) => {
    // writeOutput("my output");
    const module = "./command-line.test.ts";
    const child = childProcess.fork(module);

    child.on("exit", done);
  });
});
