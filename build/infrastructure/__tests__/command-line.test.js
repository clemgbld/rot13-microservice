"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_1 = require("../command-line");
describe("command-line nullability", () => {
    it("has no arguments by default", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        expect(NullableCommandLine.args()).toEqual([]);
    });
    it("should be able to configure arguments", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(["one", "two"]));
        expect(NullableCommandLine.args()).toEqual(["one", "two"]);
    });
    it("tracks write to sdout and turn off tracking as well", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        const { outpouts, turnOffTracking } = NullableCommandLine.trackStdout();
        NullableCommandLine.writeOutpout("A");
        expect(outpouts).toEqual(["A\n"]);
        NullableCommandLine.writeOutpout("B");
        turnOffTracking();
        expect(outpouts).toEqual([]);
    });
    it("allows output to be consume", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        const { consume } = NullableCommandLine.trackStdout();
        NullableCommandLine.writeOutpout("A");
        expect(consume()).toEqual(["A\n"]);
        NullableCommandLine.writeOutpout("B");
        expect(consume()).toEqual(["B\n"]);
    });
});
