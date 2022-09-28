"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_1 = require("../infrastructure/command-line");
var http_client_1 = require("./infrastructure/http-client");
var rot13_client_1 = require("./infrastructure/rot13-client");
var rot13_cli_1 = require("./rot13-cli");
(0, rot13_cli_1.runAsync)((0, command_line_1.commandLine)(process), (0, rot13_client_1.createRot13Client)(http_client_1.httpClient.create()));
