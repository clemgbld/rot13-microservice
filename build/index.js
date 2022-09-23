"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_1 = require("./infrastructure/command-line");
const clock_1 = require("./infrastructure/clock");
const countdown_1 = require("./countdown");
const TEXT = ["5", "4", "3", "2", "1"];
(0, countdown_1.countdownAsync)(TEXT, (0, command_line_1.commandLine)(process), clock_1.clock.create());
