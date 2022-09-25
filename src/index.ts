import { commandLine } from "./infrastructure/command-line";
import { httpServer } from "./infrastructure/http-server";
import { clock } from "./infrastructure/clock";
import { log } from "./infrastructure/log";
import { app } from "./app/rot13-server";

const realClock = clock.create();
const realCommandLine = commandLine(process);
const logger = log(realCommandLine, realClock);

app(realCommandLine, httpServer.create(logger)).startAsync();
