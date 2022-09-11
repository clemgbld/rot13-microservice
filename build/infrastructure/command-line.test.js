"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
describe("command-line nullability", () => {
    it("does not write output to command line", () => { });
});
function runModuleAsync(relativeModulePath, args) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        const absolutePath = path_1.default.resolve(__dirname, relativeModulePath);
        const child = child_process_1.default.fork(absolutePath, args, {
            stdio: "pipe",
        });
        let stdout = "";
        let stderr = "";
        (_a = child === null || child === void 0 ? void 0 : child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
            stdout += data;
        });
        (_b = child === null || child === void 0 ? void 0 : child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
            stderr += data;
        });
        child.on("exit", () => {
            if (stderr !== "") {
                console.log(stderr);
                return reject(new Error("Runner failed"));
            }
            else {
                return resolve(stdout);
            }
        });
    });
}
