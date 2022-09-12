"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandLine = exports.nullProcess = void 0;
const nullProcess = (args = []) => ({
    stdout: {
        write: (text) => { },
    },
    argv: ["null_process_node", "null_process_script.js", ...args],
});
exports.nullProcess = nullProcess;
const commandLine = (process) => {
    let lastOutpout;
    return {
        writeOutpout: (text) => {
            const outpout = `${text}\n`;
            process.stdout.write(outpout);
            lastOutpout = outpout;
        },
        args: () => process.argv.slice(2),
        getLastOutpout: () => lastOutpout,
    };
};
exports.commandLine = commandLine;
