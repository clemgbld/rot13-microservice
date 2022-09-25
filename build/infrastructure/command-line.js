"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandLine = exports.nullProcess = void 0;
const events_1 = __importDefault(require("events"));
const trackOutput_1 = require("./utils/trackOutput");
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
    return {
        writeOutpout: (text) => {
            const outpout = `${text}\n`;
            process.stdout.write(outpout);
            emitter.emit(STDOUT_EVENT, outpout);
        },
        args: () => process.argv.slice(2),
        trackStdout: () => (0, trackOutput_1.trackOutput)(emitter, STDOUT_EVENT),
    };
};
exports.commandLine = commandLine;
