import { commandLine } from "../infrastructure/command-line";
import { httpClient } from "./infrastructure/http-client";
import { createRot13Client } from "./infrastructure/rot13-client";
import { runAsync } from "./rot13-cli";

runAsync(commandLine(process), createRot13Client(httpClient.create()));
