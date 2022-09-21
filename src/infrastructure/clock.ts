import { pipe } from "ramda";
import FakeTimers from "@sinonjs/fake-timers";
import { withConstructor } from "../utils/withConstructor";

interface FakeDateConstructor {
  now: () => number;
}

interface ClockDependancy {
  Date: DateConstructor | FakeDateConstructor;
  setTimeout: (callback: () => Promise<unknown>, arg1?: number) => void;
}

const withClock =
  ({ Date, setTimeout }: ClockDependancy) =>
  (o: any) => {
    return {
      ...o,
      now: () => Date.now(),

      waitAsync: async (miliseconds: number) =>
        await new Promise((resolve) =>
          setTimeout(async () => resolve("end of the timer"), miliseconds)
        ),
      advanceNullAsync: async (miliseconds: number) => {
        await Date.advanceNullAsync(miliseconds);
      },
    };
  };

const fakeDateConstructor = (time = 0) => {
  const fake = FakeTimers.createClock(time);

  return {
    now: () => fake.Date.now(),
    advanceNullAsync: async (milliseconds: number) =>
      fake.tickAsync(milliseconds),
  };
};

interface ClockInfraBuilder {
  create: () => any;
  createNull: (params: NullConfiguartion) => any;
}

interface NullConfiguartion {
  now?: number;
}

const createClock = (
  depedancy: ClockDependancy,
  clockInfraBuilder: ClockInfraBuilder
) => pipe(withClock(depedancy), withConstructor(clockInfraBuilder))({});

export const clock = {
  create: () => createClock({ Date, setTimeout }, clock),
  createNull: ({ now }: NullConfiguartion = {}) =>
    createClock(
      { Date: fakeDateConstructor(now), setTimeout: setTimeout },
      clock
    ),
};
