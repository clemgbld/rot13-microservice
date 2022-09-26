"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_1 = require("../command-line");
describe("command-line nullability", function () {
    it("has no arguments by default", function () {
        var NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        expect(NullableCommandLine.args()).toEqual([]);
    });
    it("should be able to configure arguments", function () {
        var NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(["one", "two"]));
        expect(NullableCommandLine.args()).toEqual(["one", "two"]);
    });
    it("tracks write to sdout and turn off tracking as well", function () {
        var NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        var _a = NullableCommandLine.trackStdout(), outpouts = _a.outpouts, turnOffTracking = _a.turnOffTracking;
        NullableCommandLine.writeOutpout("A");
        expect(outpouts).toEqual(["A\n"]);
        NullableCommandLine.writeOutpout("B");
        turnOffTracking();
        expect(outpouts).toEqual([]);
    });
    it("allows output to be consume", function () {
        var NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        var consume = NullableCommandLine.trackStdout().consume;
        NullableCommandLine.writeOutpout("A");
        expect(consume()).toEqual(["A\n"]);
        NullableCommandLine.writeOutpout("B");
        expect(consume()).toEqual(["B\n"]);
    });
});
