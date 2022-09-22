import { clock } from "../clock";

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
  });
});
