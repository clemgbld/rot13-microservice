"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandLine = exports.nullProcess = void 0;
const events_1 = __importDefault(require("events"));
const STDOUT_EVENT = "stdout";
const nullProcess = (args = []) => ({
    stdout: {
        write: (text) => { },
    },
    argv: ["null_process_node", "null_process_script.js", ...args],
});
exports.nullProcess = nullProcess;
const commandLine = (process) => {
    const emitter = new events_1.default();
    const onStdout = (fn) => {
        emitter.on(STDOUT_EVENT, fn);
        return () => emitter.off(STDOUT_EVENT, fn);
    };
    return {
        writeOutpout: (text) => {
            const outpout = `${text}\n`;
            process.stdout.write(outpout);
            emitter.emit(STDOUT_EVENT, outpout);
        },
        args: () => process.argv.slice(2),
        trackStdout: () => {
            let outpouts = [];
            const off = onStdout((text) => {
                outpouts.push(text);
            });
            const consume = () => {
                let result = [...outpouts];
                outpouts.length = 0;
                return result;
            };
            const turnOffTracking = () => {
                consume();
                off();
            };
            return { outpouts, turnOffTracking, consume };
        },
    };
};
exports.commandLine = commandLine;
