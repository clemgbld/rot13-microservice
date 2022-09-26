"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clock = void 0;
var fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
var buildInfrastructure_1 = require("./utils/buildInfrastructure");
var withClock = function (_a) {
    var Date = _a.Date, DateTimeFormat = _a.DateTimeFormat, setTimeout = _a.setTimeout, _b = _a.advanceNullAsync, advanceNullAsync = _b === void 0 ? function (miliseconds) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("this method should not be use on real clock");
        });
    }); } : _b;
    return function (o) { return (__assign(__assign({}, o), { now: function () { return Date.now(); }, waitAsync: function (miliseconds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) {
                            return setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, resolve("end of the timer")];
                            }); }); }, miliseconds);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }, advanceNullAsync: function (miliseconds) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, advanceNullAsync(miliseconds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, toFormattedString: function (format, locale) {
            var formatter = DateTimeFormat(locale, format);
            return formatter.format(Date.now());
        } })); };
};
var nullGlobals = function (time, configurableLocal, timeZone) {
    if (time === void 0) { time = 0; }
    if (configurableLocal === void 0) { configurableLocal = "fr"; }
    if (timeZone === void 0) { timeZone = "UTC"; }
    var fake = fake_timers_1.default.createClock(time);
    return {
        Date: fake.Date,
        DateTimeFormat: function (locale, options) {
            if (locale === undefined) {
                locale = configurableLocal;
            }
            if (options && options.timeZone === undefined) {
                options = __assign(__assign({}, options), { timeZone: timeZone });
            }
            return Intl.DateTimeFormat(locale, options);
        },
        setTimeout: function (fn, arg1) {
            if (arg1 === void 0) { arg1 = 0; }
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    fake.setTimeout(fn, arg1);
                    return [2 /*return*/];
                });
            });
        },
        advanceNullAsync: function (milliseconds) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, fake.tickAsync(milliseconds)];
        }); }); },
    };
};
exports.clock = {
    create: function () {
        return (0, buildInfrastructure_1.buildInfrastructure)({
            dependancy: { Date: Date, DateTimeFormat: Intl.DateTimeFormat, setTimeout: setTimeout },
            infrastructureObj: exports.clock,
            withMixin: withClock,
        });
    },
    createNull: function (_a) {
        var _b = _a === void 0 ? {} : _a, now = _b.now, locale = _b.locale, timeZone = _b.timeZone;
        return (0, buildInfrastructure_1.buildInfrastructure)({
            dependancy: __assign({}, nullGlobals(now, locale, timeZone)),
            infrastructureObj: exports.clock,
            withMixin: withClock,
        });
    },
};
