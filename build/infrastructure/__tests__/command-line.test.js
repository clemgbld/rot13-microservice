"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_1 = require("../command-line");
describe("command-line nullability", () => {
    it("remembers last output", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        NullableCommandLine.writeOutpout("my last output");
        expect(NullableCommandLine.getLastOutpout()).toEqual("my last output\n");
    });
    it("should have a undefined last output when nothing has been writen yet", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        expect(NullableCommandLine.getLastOutpout()).toEqual(undefined);
    });
    it("has no arguments by default", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        expect(NullableCommandLine.args()).toEqual([]);
    });
    it("should be able to configure arguments", () => {
        const NullableCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(["one", "two"]));
        expect(NullableCommandLine.args()).toEqual(["one", "two"]);
    });
});
