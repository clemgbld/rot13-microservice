import { commandLine } from "./infrastructure/command-line";
import { clock } from "./infrastructure/clock";
import { countdownAsync } from "./countdown";

const TEXT = ["5", "4", "3", "2", "1"];

countdownAsync(TEXT, commandLine(process), clock.create());
