"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clock_1 = require("../clock");
describe("clock", () => {
    it("provides current timestamp", () => {
        const realClock = clock_1.clock.create();
        expect(realClock.now()).toBeLessThanOrEqual(Date.now());
    });
    it("waits N miliseconds", () => __awaiter(void 0, void 0, void 0, function* () {
        const realClock = clock_1.clock.create();
        const startTime = realClock.now();
        const expectedTime = 10;
        yield realClock.waitAsync(expectedTime);
        const elapsedTime = realClock.now() - startTime;
        expect(expectedTime).toBeLessThanOrEqual(elapsedTime + 1);
    }));
    it("fails fast when we use advanceNullAsync in production mode", () => {
        const realClock = clock_1.clock.create();
        expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield realClock.advanceNullAsync(0); })).rejects.toThrowError("this method should not be use on real clock");
    });
    describe("nullability", () => {
        it("defaults now to 0 miliseconds", () => {
            const fakeClock = clock_1.clock.createNull();
            expect(fakeClock.now()).toBe(0);
        });
        it("should be configurable for now", () => {
            const fakeClock = clock_1.clock.createNull({ now: 42 });
            expect(fakeClock.now()).toBe(42);
        });
        it("can advance the clock ", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeClock = clock_1.clock.createNull();
            yield fakeClock.advanceNullAsync(10);
            expect(fakeClock.now()).toBe(10);
        }));
        it("can wait", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeClock = clock_1.clock.createNull();
            let wait = "waiting";
            fakeClock.waitAsync(10).then(() => {
                wait = fakeClock.now();
            });
            expect(wait).toBe("waiting");
            yield fakeClock.advanceNullAsync(20);
            expect(wait).toBe(10);
        }));
    });
});
describe("local Date", () => {
    const checkFormattedString = (format, local) => {
        const realClock = clock_1.clock.create();
        let expectedTime = new Date().toLocaleString(local, format);
        const formattedDate = realClock.toFormattedString(format, "fr");
        if (formattedDate !== expectedTime) {
            expectedTime = new Date().toLocaleString("fr", format);
        }
        expect(formattedDate).toEqual(expectedTime);
    };
    it("outputs time using computer language and computer time zone", () => {
        const format = {
            dateStyle: "medium",
            timeStyle: "short",
        };
        checkFormattedString(format);
    });
    it("outputs the current time using the configured time zone the local", () => {
        const format = {
            timeZone: "Europe/Paris",
            timeStyle: "short",
        };
        const local = "fr";
        checkFormattedString(format, local);
    });
    describe("nullability", () => {
        it("renders to formatted string", () => {
            const format = {
                timeZone: "Europe/Paris",
                dateStyle: "medium",
                timeStyle: "short",
            };
            const fakeClock = clock_1.clock.createNull({ now: 0 });
            expect(fakeClock.toFormattedString(format, "fr")).toBe("1 janv. 1970, 01:00");
        });
        it("defaults the time zone to GMT", () => {
            const format = {
                timeStyle: "long",
            };
            const fakeClock = clock_1.clock.createNull({ now: 0 });
            expect(fakeClock.toFormattedString(format, "en-US")).toBe("12:00:00 AM UTC");
            expect(format).toEqual({
                timeStyle: "long",
            });
        });
        it("defaults locale to fr", () => {
            const format = {
                dateStyle: "medium",
                timeStyle: "long",
            };
            const fakeClock = clock_1.clock.createNull({ now: 0 });
            expect(fakeClock.toFormattedString(format)).toBe("1 janv. 1970, 00:00:00 UTC");
        });
        it("allows local time zone and locale to be configured", () => {
            const format = {
                timeStyle: "long",
            };
            const fakeClock = clock_1.clock.createNull({
                now: 0,
                timeZone: "America/New_York",
                locale: "en-US",
            });
            expect(fakeClock.toFormattedString(format)).toBe("7:00:00 PM EST");
        });
    });
});
