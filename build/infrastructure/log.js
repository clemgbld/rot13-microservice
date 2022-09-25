"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const events_1 = __importDefault(require("events"));
const ramda_1 = require("ramda");
const trackOutput_1 = require("./utils/trackOutput");
const OUTPUT_EVENT = "OUTPUT_EVENT";
const stringElseStack = (value) => value instanceof Error ? value.stack : value;
const transformErrorinStackTrace = (data) => Object.entries(data).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: stringElseStack(value) })), {});
const addAlert = (type) => (data) => (Object.assign({ alert: type }, data));
const log = (commandLine, clock) => {
    const emitter = new events_1.default();
    const options = {
        timeZone: "UTC",
        dateStyle: "medium",
        timeStyle: "long",
        hourCycle: "h23",
    };
    const doLog = (addAlertFn) => (data) => {
        const time = clock.toFormattedString(options, "en-US");
        const formatLog = (0, ramda_1.pipe)(transformErrorinStackTrace, addAlertFn);
        commandLine.writeOutpout(`${time} ${JSON.stringify(formatLog(data))}`);
        emitter.emit(OUTPUT_EVENT, addAlertFn(data));
    };
    const ALERTS_LEVELS = ["info", "debug", "monitor", "action", "emergency"];
    const buildLogs = () => ALERTS_LEVELS.reduce((logs, logStr) => (Object.assign(Object.assign({}, logs), { [logStr]: doLog(addAlert(logStr)) })), {});
    return Object.assign(Object.assign({}, buildLogs()), { trackOutput: () => (0, trackOutput_1.trackOutput)(emitter, OUTPUT_EVENT) });
};
exports.log = log;
