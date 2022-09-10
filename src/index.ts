import { rot13 } from "./rot13/rot13";
import { writeOutput, args } from "./infrastructure/command-line";

const input = args()[0];

const output = rot13(input);

writeOutput(output);
