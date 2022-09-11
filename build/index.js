"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_1 = require("./infrastructure/command-line");
const app_1 = require("./app/app");
app_1.app.run((0, command_line_1.commandLine)(process));
