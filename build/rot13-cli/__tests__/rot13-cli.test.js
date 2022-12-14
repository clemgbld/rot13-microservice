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
var command_line_1 = require("../../infrastructure/command-line");
var rot13_cli_1 = require("../rot13-cli");
var rot13_client_test_1 = require("../infrastructure/__tests__/rot13-client.test");
var rot13_client_1 = require("../infrastructure/rot13-client");
var clock_1 = require("../../infrastructure/clock");
var TIMEOUT_TIME = 5000;
describe("rot13-cli", function () {
    var setupCommandLine = function (args) {
        if (args === void 0) { args = ["9999", "valid-body"]; }
        var fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(args));
        var outpouts = fakeCommandLine.trackStdout().outpouts;
        return { fakeCommandLine: fakeCommandLine, outpouts: outpouts };
    };
    var createFakeRot13Client = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.status, status = _c === void 0 ? 200 : _c, _d = _b.headers, headers = _d === void 0 ? { "content-type": "application/json" } : _d, _e = _b.body, body = _e === void 0 ? JSON.stringify({ transformed: "Null response" }) : _e, _f = _b.hang, hang = _f === void 0 ? false : _f;
        var client = (0, rot13_client_test_1.createClient)({ status: status, headers: headers, body: body, hang: hang }).client;
        return (0, rot13_client_1.createRot13Client)(client);
    };
    it("calls ROT-13 service", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, fakeCommandLine, outpouts, fakeClock, rot13Client;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setupCommandLine(), fakeCommandLine = _a.fakeCommandLine, outpouts = _a.outpouts;
                    fakeClock = clock_1.clock.createNull({ now: 0 });
                    rot13Client = createFakeRot13Client();
                    return [4 /*yield*/, (0, rot13_cli_1.runAsync)(fakeCommandLine, rot13Client, fakeClock)];
                case 1:
                    _b.sent();
                    expect(outpouts).toEqual(["Null response\n"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should give an error message when the user do not provide  2 arguments", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, fakeCommandLine, outpouts, fakeClock, rot13Client;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setupCommandLine(["first-argument"]), fakeCommandLine = _a.fakeCommandLine, outpouts = _a.outpouts;
                    fakeClock = clock_1.clock.createNull({ now: 0 });
                    rot13Client = createFakeRot13Client();
                    return [4 /*yield*/, (0, rot13_cli_1.runAsync)(fakeCommandLine, rot13Client, fakeClock)];
                case 1:
                    _b.sent();
                    expect(outpouts).toEqual(["please provide 2 arguments\n"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should give an error message when the port that the user enter is not a valid one", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, fakeCommandLine, outpouts, fakeClock, rot13Client;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setupCommandLine([
                        "unvalid-port",
                        "valid-body",
                    ]), fakeCommandLine = _a.fakeCommandLine, outpouts = _a.outpouts;
                    fakeClock = clock_1.clock.createNull({ now: 0 });
                    rot13Client = createFakeRot13Client();
                    return [4 /*yield*/, (0, rot13_cli_1.runAsync)(fakeCommandLine, rot13Client, fakeClock)];
                case 1:
                    _b.sent();
                    expect(outpouts).toEqual([
                        "please provide a valid port as first argument\n",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should output an error when rot13 service fail", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, fakeCommandLine, outpouts, fakeClock, rot13Client;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setupCommandLine(), fakeCommandLine = _a.fakeCommandLine, outpouts = _a.outpouts;
                    fakeClock = clock_1.clock.createNull({ now: 0 });
                    rot13Client = createFakeRot13Client({ status: 400 });
                    return [4 /*yield*/, (0, rot13_cli_1.runAsync)(fakeCommandLine, rot13Client, fakeClock)];
                case 1:
                    _b.sent();
                    expect(outpouts).toEqual([
                        "Unexpected status from ROT 13 service\nHost:localhost:9999\nStatus: 400\nHeaders: ".concat(JSON.stringify({
                            "content-type": "application/json",
                        }), "\nBody: ").concat(JSON.stringify({ transformed: "Null response" }), "\n"),
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("timesout rot13 client when Rot13 client respond too slowly", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, fakeCommandLine, outpouts, fakeClock, rot13Client, requests, runPromise;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setupCommandLine(), fakeCommandLine = _a.fakeCommandLine, outpouts = _a.outpouts;
                    fakeClock = clock_1.clock.createNull({ now: 0 });
                    rot13Client = createFakeRot13Client({ status: 200, hang: true });
                    requests = rot13Client.trackRequests().outpouts;
                    runPromise = (0, rot13_cli_1.runAsync)(fakeCommandLine, rot13Client, fakeClock);
                    fakeClock.advanceNullAsync(TIMEOUT_TIME);
                    return [4 /*yield*/, expect(runPromise).toBeAResolvedPromise()];
                case 1:
                    _b.sent();
                    expect(requests).toEqual([
                        { port: 9999, text: "valid-body" },
                        { port: 9999, text: "valid-body", cancelled: true },
                    ]);
                    expect(outpouts).toEqual(["Rot13 service failed due to a timeout\n"]);
                    return [2 /*return*/];
            }
        });
    }); });
});
