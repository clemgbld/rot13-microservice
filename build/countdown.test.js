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
const countdown_1 = require("./countdown");
const command_line_1 = require("./infrastructure/command-line");
const clock_1 = require("./infrastructure/clock");
describe("countdown", () => {
    const advanceOneSecondAsync = (clock) => __awaiter(void 0, void 0, void 0, function* () { return yield clock.advanceNullAsync(1000); });
    it("writes one lines at a time, waiting one seconds after each line", () => __awaiter(void 0, void 0, void 0, function* () {
        const text = ["3", "2", "1"];
        const nullCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
        const fakeClock = clock_1.clock.createNull({
            now: 0,
            locale: "uk",
            timeZone: "America/New_York",
        });
        const { outpouts, consume } = nullCommandLine.trackStdout();
        (0, countdown_1.countdownAsync)(text, nullCommandLine, fakeClock);
        expect(consume()).toEqual(["3\n"]);
        yield advanceOneSecondAsync(fakeClock);
        expect(consume()).toEqual(["2\n"]);
        yield advanceOneSecondAsync(fakeClock);
        expect(outpouts).toEqual(["1\n", "31 груд. 1969 р., 19:00\n"]);
    }));
});
