"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_1 = require("../infrastructure/command-line");
var rot13_cli_1 = require("./rot13-cli");
(0, rot13_cli_1.runAsync)((0, command_line_1.commandLine)(process));
