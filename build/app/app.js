"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const rot13_1 = require("../core/rot13");
exports.app = {
    run: (commandLine) => {
        const input = commandLine.args();
        if (input.length > 1)
            return commandLine.writeOutpout("too many arguments");
        if (input.length === 0)
            return commandLine.writeOutpout("please provide a string");
        const output = (0, rot13_1.rot13)(input[0]);
        commandLine.writeOutpout(output);
    },
};
