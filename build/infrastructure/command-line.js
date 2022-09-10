"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.args = exports.writeOutput = void 0;
const writeOutput = (text) => {
    console.log(text);
};
exports.writeOutput = writeOutput;
const args = () => process.argv.slice(2);
exports.args = args;
