"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandLine = void 0;
const withConstructor_1 = require("../utils/withConstructor");
const ramda_1 = require("ramda");
const withStdout = (o) => {
    let lastOutput = "";
    return Object.assign(Object.assign({}, o), { writeOutpout: (text) => {
            lastOutput = text;
        }, getLastOutpout: () => lastOutput });
};
const createFakeCommandLine = () => (0, ramda_1.pipe)(withStdout, (0, withConstructor_1.withConstructor)(createFakeCommandLine))({});
const commandLine = (process) => ({
    writeOutpout: (text) => process.stdout.write(`${text}\n`),
    args: () => process.argv.slice(2),
    createNull: () => createFakeCommandLine(),
});
exports.commandLine = commandLine;
