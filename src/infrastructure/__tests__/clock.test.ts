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
});
