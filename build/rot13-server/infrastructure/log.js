"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var events_1 = __importDefault(require("events"));
var ramda_1 = require("ramda");
var trackOutput_1 = require("../../infrastructure/utils/trackOutput");
var OUTPUT_EVENT = "OUTPUT_EVENT";
var stringElseStack = function (value) {
    return value instanceof Error ? value.stack : value;
};
var transformErrorinStackTrace = function (data) {
    return Object.entries(data).reduce(function (acc, _a) {
        var _b;
        var key = _a[0], value = _a[1];
        return (__assign(__assign({}, acc), (_b = {}, _b[key] = stringElseStack(value), _b)));
    }, {});
};
var addAlert = function (type) { return function (data) { return (__assign({ alert: type }, data)); }; };
var log = function (commandLine, clock) {
    var emitter = new events_1.default();
    var options = {
        timeZone: "UTC",
        dateStyle: "medium",
        timeStyle: "long",
        hourCycle: "h23",
    };
    var doLog = function (addAlertFn) {
        return function (data) {
            var time = clock.toFormattedString(options, "en-US");
            var formatLog = (0, ramda_1.pipe)(transformErrorinStackTrace, addAlertFn);
            commandLine.writeOutpout("".concat(time, " ").concat(JSON.stringify(formatLog(data))));
            emitter.emit(OUTPUT_EVENT, addAlertFn(data));
        };
    };
    var ALERTS_LEVELS = ["info", "debug", "monitor", "action", "emergency"];
    var buildLogs = function () {
        return ALERTS_LEVELS.reduce(function (logs, logStr) {
            var _a;
            return (__assign(__assign({}, logs), (_a = {}, _a[logStr] = doLog(addAlert(logStr)), _a)));
        }, {});
    };
    return __assign(__assign({}, buildLogs()), { trackOutput: function () { return (0, trackOutput_1.trackOutput)(emitter, OUTPUT_EVENT); } });
};
exports.log = log;
