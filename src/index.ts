import { commandLine } from "./infrastructure/command-line";
import { httpServer } from "./infrastructure/http-server";
import { app } from "./app/rot13-server";

app(commandLine(process), httpServer.create()).startAsync();
