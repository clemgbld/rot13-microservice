"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
const command_line_1 = require("../command-line");
const clock_1 = require("../clock");
describe("log", () => {
    const createLogger = () => {
        const fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        const fakeClock = clock_1.clock.createNull({ now: 0 });
        const { outpouts: stdout } = fakeCommandLine.trackStdout();
        const logger = (0, log_1.log)(fakeCommandLine, fakeClock);
        const { outpouts } = logger.trackOutput();
        return { logger, stdout, outpouts };
    };
    it("outputs current time ", () => {
        const { logger, stdout } = createLogger();
        const data = {
            output: "my output",
        };
        const expectedData = {
            alert: "info",
            output: "my output",
        };
        logger.info(data);
        expect(stdout).toEqual([
            `Jan 1, 1970, 00:00:00 UTC ${JSON.stringify(expectedData)}\n`,
        ]);
    });
    it("outpouts the full stack trace for the erros", () => {
        const { logger, stdout } = createLogger();
        const data = {
            output: new Error("my error"),
        };
        logger.info(data);
        expect(stdout[0]).toMatch(/Jan 1, 1970, 00:00:00 UTC {"alert":"info","output":"Error: my error\\n    at/);
    });
    it("provides multiple alert levels", () => {
        const { logger, outpouts } = createLogger();
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
    it("can track the output", () => {
        const { logger, outpouts } = createLogger();
        const data = {
            output: "my output",
        };
        const expectedData = {
            alert: "info",
            output: "my output",
        };
        logger.info(data);
        expect(outpouts).toEqual([expectedData]);
    });
    it("strips the tracker stack traces", () => {
        const { logger, outpouts } = createLogger();
        const data = {
            output: new Error("my error"),
        };
        const expectedData = {
            alert: "info",
            output: new Error("my error"),
        };
        logger.info(data);
        expect(outpouts).toEqual([expectedData]);
    });
});
