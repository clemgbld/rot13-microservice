import { writeOutpout, args } from "./infrastructure/command-line";
import { app } from "./app/app";

app.run({ writeOutpout, args });
