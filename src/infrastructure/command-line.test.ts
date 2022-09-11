import childProcess from "child_process";
import path from "path";

describe("command-line nullability", () => {
  it("does not write output to command line", () => {});
});

function runModuleAsync(relativeModulePath: string, args: string[]) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(__dirname, relativeModulePath);
    
    const child = childProcess.fork(absolutePath, args, {
        stdio: "pipe",
      });

    let stdout = "";
    let stderr = "";
    child?.stdout?.on("data", (data) => {
      stdout += data;
    });
    child?.stderr?.on("data", (data) => {
      stderr += data;
    });

    child.on("exit", () => {
      if (stderr !== "") {
        console.log(stderr);
        return reject(new Error("Runner failed"));
      } else {
        return resolve(stdout);
      }
    });
  });
}
