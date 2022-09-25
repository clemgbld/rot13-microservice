import { commandLine } from "./infrastructure/command-line";
import { httpServer } from "./rot13-server/infrastructure/http-server";
import { clock } from "./infrastructure/clock";
import { log } from "./rot13-server/infrastructure/log";
import { app } from "./rot13-server/app/rot13-server";

const realClock = clock.create();
const realCommandLine = commandLine(process);
const logger = log(realCommandLine, realClock);

app(realCommandLine, httpServer.create(logger)).startAsync();
