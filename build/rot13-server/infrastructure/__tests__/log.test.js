"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../log");
var command_line_1 = require("../../../infrastructure/command-line");
var clock_1 = require("../../../infrastructure/clock");
describe("log", function () {
    var createLogger = function () {
        var fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        var fakeClock = clock_1.clock.createNull({ now: 0 });
        var stdout = fakeCommandLine.trackStdout().outpouts;
        var logger = (0, log_1.log)(fakeCommandLine, fakeClock);
        var outpouts = logger.trackOutput().outpouts;
        return { logger: logger, stdout: stdout, outpouts: outpouts };
    };
    it("outputs current time ", function () {
        var _a = createLogger(), logger = _a.logger, stdout = _a.stdout;
        var data = {
            output: "my output",
        };
        var expectedData = {
            alert: "info",
            output: "my output",
        };
        logger.info(data);
        expect(stdout).toEqual([
            "Jan 1, 1970, 00:00:00 UTC ".concat(JSON.stringify(expectedData), "\n"),
        ]);
    });
    it("outpouts the full stack trace for the erros", function () {
        var _a = createLogger(), logger = _a.logger, stdout = _a.stdout;
        var data = {
            output: new Error("my error"),
        };
        logger.info(data);
        expect(stdout[0]).toMatch(/Jan 1, 1970, 00:00:00 UTC {"alert":"info","output":"Error: my error\\n    at/);
    });
    it("provides multiple alert levels", function () {
        var _a = createLogger(), logger = _a.logger, outpouts = _a.outpouts;
        logger.info({});
        logger.debug({});
        logger.monitor({});
        logger.action({});
        logger.emergency({});
        expect(outpouts).toEqual([
            { alert: "info" },
            { alert: "debug" },
            { alert: "monitor" },
            { alert: "action" },
            { alert: "emergency" },
        ]);
    });
    it("can track the output", function () {
        var _a = createLogger(), logger = _a.logger, outpouts = _a.outpouts;
        var data = {
            output: "my output",
        };
        var expectedData = {
            alert: "info",
            output: "my output",
        };
        logger.info(data);
        expect(outpouts).toEqual([expectedData]);
    });
    it("strips the tracker stack traces", function () {
        var _a = createLogger(), logger = _a.logger, outpouts = _a.outpouts;
        var data = {
            output: new Error("my error"),
        };
        var expectedData = {
            alert: "info",
            output: new Error("my error"),
        };
        logger.info(data);
        expect(outpouts).toEqual([expectedData]);
    });
});
