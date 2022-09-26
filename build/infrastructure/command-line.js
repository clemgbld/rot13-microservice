"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandLine = exports.nullProcess = void 0;
var events_1 = __importDefault(require("events"));
var trackOutput_1 = require("./utils/trackOutput");
var STDOUT_EVENT = "stdout";
var nullProcess = function (args) {
    if (args === void 0) { args = []; }
    return ({
        stdout: {
            write: function (text) { },
        },
        argv: __spreadArray(["null_process_node", "null_process_script.js"], args, true),
    });
};
exports.nullProcess = nullProcess;
var commandLine = function (process) {
    var emitter = new events_1.default();
    return {
        writeOutpout: function (text) {
            var outpout = "".concat(text, "\n");
            process.stdout.write(outpout);
            emitter.emit(STDOUT_EVENT, outpout);
        },
        args: function () { return process.argv.slice(2); },
        trackStdout: function () { return (0, trackOutput_1.trackOutput)(emitter, STDOUT_EVENT); },
    };
};
exports.commandLine = commandLine;
