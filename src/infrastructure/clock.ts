import FakeTimers from "@sinonjs/fake-timers";
import { buildInfrastructure } from "./utils/buildInfrastructure";

export interface Clock {
  Date: DateConstructor;
  waitAsync: (miliseconds: number) => Promise<unknown>;
  advanceNullAsync: (miliseconds: number) => Promise<void>;
  toFormattedString: (
    format: Record<string, string>,
    locale?: string
  ) => string;
}

interface ClockDependancy {
  Date: DateConstructor;
  DateTimeFormat: any;
  setTimeout: (callback: () => Promise<unknown>, arg1?: number) => void;
  advanceNullAsync?: (milliseconds: number) => Promise<number>;
}

const withClock =
  ({
    Date,
    DateTimeFormat,
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
    toFormattedString: (format: Record<string, string>, locale?: string) => {
      const formatter = DateTimeFormat(locale, format);
      return formatter.format(Date.now());
    },
  });

const nullGlobals = (time = 0, configurableLocal = "fr", timeZone = "UTC") => {
  const fake = FakeTimers.createClock(time);

  return {
    Date: fake.Date,
    DateTimeFormat: (locale?: string, options?: Record<string, string>) => {
      if (locale === undefined) {
        locale = configurableLocal;
      }
      if (options && options.timeZone === undefined) {
        options = { ...options, timeZone };
      }
      return Intl.DateTimeFormat(locale, options);
    },
    setTimeout: async (fn: () => Promise<unknown>, arg1 = 0) => {
      fake.setTimeout(fn, arg1);
    },
    advanceNullAsync: async (milliseconds: number) =>
      fake.tickAsync(milliseconds),
  };
};

interface NullConfiguartion {
  now?: number;
  locale?: string;
  timeZone?: string;
}

export const clock = {
  create: () =>
    buildInfrastructure({
      dependancy: { Date, DateTimeFormat: Intl.DateTimeFormat, setTimeout },
      infrastructureObj: clock,
      withMixin: withClock,
    }),
  createNull: ({ now, locale, timeZone }: NullConfiguartion = {}) =>
    buildInfrastructure({
      dependancy: { ...nullGlobals(now, locale, timeZone) },
      infrastructureObj: clock,
      withMixin: withClock,
    }),
};
