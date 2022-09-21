import { withConstructor } from "../utils/withConstructor";
import { pipe } from "ramda";
interface ClockDependancy {
  now: () => number;
  setTimeout: (callback: () => Promise<unknown>, arg1?: number) => void;
}

const withClock =
  ({ now, setTimeout }: ClockDependancy) =>
  (o: any) => {
    return {
      ...o,
      now: () => now(),

      waitAsync: async (miliseconds: number) =>
        await new Promise((resolve) =>
          setTimeout(async () => resolve("end of the timer"), miliseconds)
        ),
    };
  };

export const clock = {
  create: () =>
    pipe(
      withClock({ now: Date.now, setTimeout: setTimeout }),
      withConstructor(clock)
    )({}),
  createNull: () =>
    pipe(
      withClock({ now: Date.now, setTimeout: setTimeout }),
      withConstructor(clock)
    )({}),
};
