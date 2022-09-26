"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_1 = require("../../infrastructure/command-line");
var rot13_cli_1 = require("../rot13-cli");
describe("rot13-cli", function () {
    var setupCommandLine = function (args) {
        if (args === void 0) { args = ["something1", "something2"]; }
        var fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(args));
        var outpouts = fakeCommandLine.trackStdout().outpouts;
        return { fakeCommandLine: fakeCommandLine, outpouts: outpouts };
    };
    it("should write todo", function () {
        var _a = setupCommandLine(), fakeCommandLine = _a.fakeCommandLine, outpouts = _a.outpouts;
        (0, rot13_cli_1.runAsync)(fakeCommandLine);
        expect(outpouts).toEqual(["TODO\n"]);
    });
    it("should give an error message when the user do not provide  2 arguments", function () {
        var _a = setupCommandLine(["something1"]), fakeCommandLine = _a.fakeCommandLine, outpouts = _a.outpouts;
        (0, rot13_cli_1.runAsync)(fakeCommandLine);
        expect(outpouts).toEqual(["please provide 2 arguments\n"]);
    });
});
