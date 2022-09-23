import { clock, Clock } from "../clock";

describe("clock", () => {
  it("provides current timestamp", () => {
    const realClock = clock.create();
    expect(realClock.now()).toBeLessThanOrEqual(Date.now());
  });

  it("waits N miliseconds", async () => {
    const realClock = clock.create();
    const startTime = realClock.now();
    const expectedTime = 10;
    await realClock.waitAsync(expectedTime);
    const elapsedTime = realClock.now() - startTime;
    expect(expectedTime).toBeLessThanOrEqual(elapsedTime + 1);
  });

  it("fails fast when we use advanceNullAsync in production mode", () => {
    const realClock = clock.create();

    expect(
      async () => await realClock.advanceNullAsync(0)
    ).rejects.toThrowError("this method should not be use on real clock");
  });

  describe("nullability", () => {
    it("defaults now to 0 miliseconds", () => {
      const fakeClock = clock.createNull();
      expect(fakeClock.now()).toBe(0);
    });

    it("should be configurable for now", () => {
      const fakeClock = clock.createNull({ now: 42 });
      expect(fakeClock.now()).toBe(42);
    });

    it("can advance the clock ", async () => {
      const fakeClock = clock.createNull();
      await fakeClock.advanceNullAsync(10);
      expect(fakeClock.now()).toBe(10);
    });

    it("can wait", async () => {
      const fakeClock = clock.createNull();
      let wait: number | string = "waiting";
      fakeClock.waitAsync(10).then(() => {
        wait = fakeClock.now();
      });
      expect(wait).toBe("waiting");
      await fakeClock.advanceNullAsync(20);
      expect(wait).toBe(10);
    });
  });
});

describe("local Date", () => {
  const checkFormattedString = (
    format: Record<string, string>,
    local?: string
  ) => {
    const realClock = clock.create();
    let expectedTime = new Date().toLocaleString(local, format);
    const formattedDate = realClock.toFormattedString(format, "fr");

    if (formattedDate !== expectedTime) {
      expectedTime = new Date().toLocaleString("fr", format);
    }
    expect(formattedDate).toEqual(expectedTime);
  };

  it("outputs time using computer language and computer time zone", () => {
    const format: Record<string, string> = {
      dateStyle: "medium",
      timeStyle: "short",
    };

    checkFormattedString(format);
  });

  it("outputs the current time using the configured time zone the local", () => {
    const format: Record<string, string> = {
      timeZone: "Europe/Paris",
      timeStyle: "short",
    };

    const local = "fr";

    checkFormattedString(format, local);
  });

  describe("nullability", () => {
    it("renders to formatted string", () => {
      const format: Record<string, string> = {
        timeZone: "Europe/Paris",
        dateStyle: "medium",
        timeStyle: "short",
      };

      const fakeClock = clock.createNull({ now: 0 });

      expect(fakeClock.toFormattedString(format, "fr")).toBe(
        "1 janv. 1970, 01:00"
      );
    });

    it("defaults the time zone to GMT", () => {
      const format: Record<string, string> = {
        timeStyle: "long",
      };

      const fakeClock = clock.createNull({ now: 0 });

      expect(fakeClock.toFormattedString(format, "en-US")).toBe(
        "12:00:00 AM UTC"
      );
      expect(format).toEqual({
        timeStyle: "long",
      });
    });

    it("defaults locale to fr", () => {
      const format: Record<string, string> = {
        dateStyle: "medium",
        timeStyle: "long",
      };

      const fakeClock = clock.createNull({ now: 0 });
      expect(fakeClock.toFormattedString(format)).toBe(
        "1 janv. 1970, 00:00:00 UTC"
      );
    });

    it("allows local time zone and locale to be configured", () => {
      const format: Record<string, string> = {
        timeStyle: "long",
      };

      const fakeClock = clock.createNull({
        now: 0,
        timeZone: "America/New_York",
        locale: "en-US",
      });

      expect(fakeClock.toFormattedString(format)).toBe("7:00:00 PM EST");
    });
  });
});
