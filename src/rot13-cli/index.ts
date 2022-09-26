import { commandLine } from "../infrastructure/command-line";
import { runAsync } from "./rot13-cli";

runAsync(commandLine(process));
