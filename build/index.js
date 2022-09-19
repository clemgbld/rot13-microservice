"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_1 = require("./infrastructure/command-line");
const http_server_1 = require("./infrastructure/http-server");
const rot13_server_1 = require("./app/rot13-server");
(0, rot13_server_1.app)((0, command_line_1.commandLine)(process), http_server_1.httpServer.create()).startAsync();
