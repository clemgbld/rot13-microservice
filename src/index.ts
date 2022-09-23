import { clock } from "./infrastructure/clock";
import { commandLine } from "./infrastructure/command-line";
import { go } from "./clock-exemple/clock-exemple";

go(commandLine(process), clock.create());
