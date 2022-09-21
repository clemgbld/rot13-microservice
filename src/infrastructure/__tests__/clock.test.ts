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
    expect(expectedTime).toBeLessThanOrEqual(elapsedTime);
  });

  describe("nullability", () => {
    it("defaults to 0 miliseconds", () => {
      const fakeClock = clock.createNull();
    });
  });
});
