"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
describe("app", () => {
    const SUTBuilder = () => ({
        excuteCommandLineWith: (argsOutpout) => {
            const writeOutpout = jest.fn();
            const commandLine = { writeOutpout, args: () => argsOutpout };
            app_1.app.run(commandLine);
            return {
                expectCommanLineToPrint: (expectedOutput) => expect(writeOutpout).toHaveBeenCalledWith(expectedOutput),
            };
        },
    });
    it("read command line arguments transform it with rot13 and write result", () => {
        const { expectCommanLineToPrint } = SUTBuilder().excuteCommandLineWith([
            "my input",
        ]);
        expectCommanLineToPrint("zl vachg");
    });
    it("writes please provide a string to the command line when no argument provided", () => {
        const { expectCommanLineToPrint } = SUTBuilder().excuteCommandLineWith([]);
        expectCommanLineToPrint("please provide a string");
    });
    it("complains when too many arguments are provided ", () => {
        const { expectCommanLineToPrint } = SUTBuilder().excuteCommandLineWith([
            "a",
            "b",
        ]);
        expectCommanLineToPrint("too many arguments");
    });
});
