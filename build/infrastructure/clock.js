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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clock = void 0;
const ramda_1 = require("ramda");
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const withConstructor_1 = require("../utils/withConstructor");
const withClock = ({ Date, DateTimeFormat, setTimeout, advanceNullAsync = (miliseconds) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error("this method should not be use on real clock");
}), }) => (o) => (Object.assign(Object.assign({}, o), { now: () => Date.now(), waitAsync: (miliseconds) => __awaiter(void 0, void 0, void 0, function* () {
        return yield new Promise((resolve) => setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return resolve("end of the timer"); }), miliseconds));
    }), advanceNullAsync: (miliseconds) => __awaiter(void 0, void 0, void 0, function* () {
        yield advanceNullAsync(miliseconds);
    }), toFormattedString: (format, locale) => {
        const formatter = DateTimeFormat(locale, format);
        return formatter.format(Date.now());
    } }));
const nullGlobals = (time = 0, configurableLocal = "fr", timeZone = "UTC") => {
    const fake = fake_timers_1.default.createClock(time);
    return {
        Date: fake.Date,
        DateTimeFormat: (locale, options) => {
            if (locale === undefined) {
                locale = configurableLocal;
            }
            if (options && options.timeZone === undefined) {
                options = Object.assign(Object.assign({}, options), { timeZone });
            }
            return Intl.DateTimeFormat(locale, options);
        },
        setTimeout: (fn, arg1 = 0) => __awaiter(void 0, void 0, void 0, function* () {
            fake.setTimeout(fn, arg1);
        }),
        advanceNullAsync: (milliseconds) => __awaiter(void 0, void 0, void 0, function* () { return fake.tickAsync(milliseconds); }),
    };
};
const createClock = (depedancy, clockInfraBuilder) => (0, ramda_1.pipe)(withClock(depedancy), (0, withConstructor_1.withConstructor)(clockInfraBuilder))({});
exports.clock = {
    create: () => createClock({ Date, DateTimeFormat: Intl.DateTimeFormat, setTimeout }, exports.clock),
    createNull: ({ now, locale, timeZone } = {}) => createClock(Object.assign({}, nullGlobals(now, locale, timeZone)), exports.clock),
};
