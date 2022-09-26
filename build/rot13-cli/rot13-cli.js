"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAsync = void 0;
var runAsync = function (commandLine) {
    var args = commandLine.args();
    if (args.length !== 2)
        return commandLine.writeOutpout("please provide 2 arguments");
    commandLine.writeOutpout("TODO");
};
exports.runAsync = runAsync;
