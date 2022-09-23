import { pipe } from "ramda";
import FakeTimers from "@sinonjs/fake-timers";
import { withConstructor } from "../utils/withConstructor";

export interface Clock {
  now: () => number;
  waitAsync: (miliseconds: number) => Promise<unknown>;
  advanceNullAsync: (miliseconds: number) => Promise<void>;
  toFormattedString: (format: Record<string, string>, locale?: string) => string
}

interface FakeDateConstructor {
  now: () => number;
  advanceNullAsync?: (milliseconds: number) => Promise<number>;
}

interface ClockDependancy {
  Date: FakeDateConstructor;
  setTimeout: (callback: () => Promise<unknown>, arg1?: number) => void;
  advanceNullAsync?: (milliseconds: number) => Promise<number>;
}

const withClock =
  ({
    Date,
    setTimeout,
    advanceNullAsync = async (miliseconds: number) => {
      throw new Error("this method should not be use on real clock");
    },
  }: ClockDependancy) =>
  (o: any) => ({
    ...o,
    now: () => Date.now(),

    waitAsync: async (miliseconds: number) =>
      await new Promise((resolve) =>
        setTimeout(async () => resolve("end of the timer"), miliseconds)
      ),
    advanceNullAsync: async (miliseconds: number) => {
      await advanceNullAsync(miliseconds);
    },
  });

const withLocalTime = (o: any) => ( {
    ...o,
    toFormattedString: (format: Record<string, string>,locale?:string) =>
      new Date().toLocaleString(locale, format),
  })

const nullGlobals = (time = 0) => {
  const fake = FakeTimers.createClock(time);
  return {
    Date: {
      now: () => fake.Date.now(),
    },
    setTimeout: async (fn: () => Promise<unknown>, arg1 = 0) => {
      fake.setTimeout(fn, arg1);
    },
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
) =>
  pipe(
    withClock(depedancy),
    withLocalTime,
    withConstructor(clockInfraBuilder)
  )({});

export const clock = {
  create: () => createClock({ Date, setTimeout }, clock),
  createNull: ({ now }: NullConfiguartion = {}) =>
    createClock({ ...nullGlobals(now) }, clock),
};
