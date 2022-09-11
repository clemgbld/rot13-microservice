import { commandLine } from "./infrastructure/command-line";
import { app } from "./app/app";

app.run(commandLine(process));
