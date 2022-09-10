"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot13_1 = require("./core/rot13");
const command_line_1 = require("./infrastructure/command-line");
const input = (0, command_line_1.args)()[0];
const output = (0, rot13_1.rot13)(input);
(0, command_line_1.writeOutput)(output);
