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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var clock_1 = require("../clock");
describe("clock", function () {
    it("provides current timestamp", function () {
        var realClock = clock_1.clock.create();
        expect(realClock.now()).toBeLessThanOrEqual(Date.now());
    });
    it("waits N miliseconds", function () { return __awaiter(void 0, void 0, void 0, function () {
        var realClock, startTime, expectedTime, elapsedTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    realClock = clock_1.clock.create();
                    startTime = realClock.now();
                    expectedTime = 10;
                    return [4 /*yield*/, realClock.waitAsync(expectedTime)];
                case 1:
                    _a.sent();
                    elapsedTime = realClock.now() - startTime;
                    expect(expectedTime).toBeLessThanOrEqual(elapsedTime + 1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("fails fast when we use advanceNullAsync in production mode", function () {
        var realClock = clock_1.clock.create();
        expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, realClock.advanceNullAsync(0)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }).rejects.toThrowError("this method should not be use on real clock");
    });
    describe("nullability", function () {
        it("defaults now to 0 miliseconds", function () {
            var fakeClock = clock_1.clock.createNull();
            expect(fakeClock.now()).toBe(0);
        });
        it("should be configurable for now", function () {
            var fakeClock = clock_1.clock.createNull({ now: 42 });
            expect(fakeClock.now()).toBe(42);
        });
        it("can advance the clock ", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeClock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeClock = clock_1.clock.createNull();
                        return [4 /*yield*/, fakeClock.advanceNullAsync(10)];
                    case 1:
                        _a.sent();
                        expect(fakeClock.now()).toBe(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it("can wait", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeClock, wait;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeClock = clock_1.clock.createNull();
                        wait = "waiting";
                        fakeClock.waitAsync(10).then(function () {
                            wait = fakeClock.now();
                        });
                        expect(wait).toBe("waiting");
                        return [4 /*yield*/, fakeClock.advanceNullAsync(20)];
                    case 1:
                        _a.sent();
                        expect(wait).toBe(10);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe("local Date", function () {
    var checkFormattedString = function (format, local) {
        var realClock = clock_1.clock.create();
        var expectedTime = new Date().toLocaleString(local, format);
        var formattedDate = realClock.toFormattedString(format, "fr");
        if (formattedDate !== expectedTime) {
            expectedTime = new Date().toLocaleString("fr", format);
        }
        expect(formattedDate).toEqual(expectedTime);
    };
    it("outputs time using computer language and computer time zone", function () {
        var format = {
            dateStyle: "medium",
            timeStyle: "short",
        };
        checkFormattedString(format);
    });
    it("outputs the current time using the configured time zone the local", function () {
        var format = {
            timeZone: "Europe/Paris",
            timeStyle: "short",
        };
        var local = "fr";
        checkFormattedString(format, local);
    });
    describe("nullability", function () {
        it("renders to formatted string", function () {
            var format = {
                timeZone: "Europe/Paris",
                dateStyle: "medium",
                timeStyle: "short",
            };
            var fakeClock = clock_1.clock.createNull({ now: 0 });
            expect(fakeClock.toFormattedString(format, "fr")).toBe("1 janv. 1970, 01:00");
        });
        it("defaults the time zone to GMT", function () {
            var format = {
                timeStyle: "long",
            };
            var fakeClock = clock_1.clock.createNull({ now: 0 });
            expect(fakeClock.toFormattedString(format, "en-US")).toBe("12:00:00 AM UTC");
            expect(format).toEqual({
                timeStyle: "long",
            });
        });
        it("defaults locale to fr", function () {
            var format = {
                dateStyle: "medium",
                timeStyle: "long",
            };
            var fakeClock = clock_1.clock.createNull({ now: 0 });
            expect(fakeClock.toFormattedString(format)).toBe("1 janv. 1970, 00:00:00 UTC");
        });
        it("allows local time zone and locale to be configured", function () {
            var format = {
                timeStyle: "long",
            };
            var fakeClock = clock_1.clock.createNull({
                now: 0,
                timeZone: "America/New_York",
                locale: "en-US",
            });
            expect(fakeClock.toFormattedString(format)).toBe("7:00:00 PM EST");
        });
    });
});
