import { CommandLine } from "../infrastructure/command-line";
import { Rot13Client } from "./infrastructure/rot13-client";
import { Clock } from "../infrastructure/clock";

const timeoutAsync = async (clock: Clock) => {
  await clock.waitAsync(5000);
  throw new Error("Rot13 service failed due to a timeout");
};

export const runAsync = async (
  commandLine: CommandLine,
  rot13Client: Rot13Client,
  clock: Clock
) => {
  const args = commandLine.args();

  if (args.length !== 2)
    return commandLine.writeOutpout("please provide 2 arguments");

  const [port, text] = args;

  if (Number.isNaN(+port)) {
    return commandLine.writeOutpout(
      "please provide a valid port as first argument"
    );
  }

  try {
    const response = await Promise.race([
      rot13Client.transformAsync(+port, text),
      timeoutAsync(clock),
    ]);
    commandLine.writeOutpout(response);
  } catch (err: any) {
    commandLine.writeOutpout(err.message);
  }
};
