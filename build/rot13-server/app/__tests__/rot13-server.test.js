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
exports.createFakeServer = void 0;
var http_server_1 = require("../../infrastructure/http-server");
var command_line_1 = require("../../../infrastructure/command-line");
var clock_1 = require("../../../infrastructure/clock");
var log_1 = require("../../infrastructure/log");
var http_request_1 = require("../../infrastructure/http-request");
var rot13_1 = require("../../core/rot13");
var rot13_server_1 = require("../rot13-server");
var createLogger = function () {
    var fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
    var fakeClock = clock_1.clock.createNull({ now: 0 });
    return (0, log_1.log)(fakeCommandLine, fakeClock);
};
var createFakeServer = function () {
    var logger = createLogger();
    var server = http_server_1.httpServer.createNull(logger);
    return server;
};
exports.createFakeServer = createFakeServer;
var startServerAsync = function (args) {
    if (args === void 0) { args = ["5000"]; }
    return __awaiter(void 0, void 0, void 0, function () {
        var nullCommandLine, nullHttpServer, consume, myApp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nullCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(args));
                    nullHttpServer = (0, exports.createFakeServer)();
                    consume = nullCommandLine.trackStdout().consume;
                    myApp = (0, rot13_server_1.app)(nullCommandLine, nullHttpServer);
                    return [4 /*yield*/, myApp.startAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { nullHttpServer: nullHttpServer, consume: consume }];
            }
        });
    });
};
var VALID_URL = "/rot-13/transform";
var VALID_METHOD = "POST";
var simulateRequestAsync = function (_a) {
    var _b = _a.url, url = _b === void 0 ? VALID_URL : _b, _c = _a.body, body = _c === void 0 ? { text: "" } : _c, _d = _a.method, method = _d === void 0 ? VALID_METHOD : _d, _e = _a.headers, headers = _e === void 0 ? { "content-type": "application/json;charset=utf-8" } : _e;
    return __awaiter(void 0, void 0, void 0, function () {
        var _f, consume, nullHttpServer, request, response;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, startServerAsync()];
                case 1:
                    _f = _g.sent(), consume = _f.consume, nullHttpServer = _f.nullHttpServer;
                    consume();
                    request = http_request_1.httpRequest.createNull({
                        url: url,
                        body: typeof body === "object" ? JSON.stringify(body) : body,
                        method: method,
                        headers: headers,
                    });
                    return [4 /*yield*/, nullHttpServer.simulateRequest(request)];
                case 2:
                    response = _g.sent();
                    return [2 /*return*/, { consume: consume, response: response }];
            }
        });
    });
};
var expectResponseToEqual = function (_a) {
    var status = _a.status, value = _a.value, response = _a.response;
    return expect(response).toEqual({
        status: status,
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(value),
    });
};
describe("ROT13-Server", function () {
    it("starts the server", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, consume, nullHttpServer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, startServerAsync(["5000"])];
                case 1:
                    _a = _b.sent(), consume = _a.consume, nullHttpServer = _a.nullHttpServer;
                    expect(nullHttpServer.isStarted()).toBe(true);
                    expect(consume()).toEqual(["Server started on port 5000\n"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("logs 'Recieved request' to the command-line when request is received", function () { return __awaiter(void 0, void 0, void 0, function () {
        var consume;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, simulateRequestAsync({})];
                case 1:
                    consume = (_a.sent()).consume;
                    expect(consume()).toEqual(["Recevied request\n"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("transforms request", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, simulateRequestAsync({
                        url: VALID_URL,
                        body: { text: "hello" },
                    })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 200,
                        value: { transformed: (0, rot13_1.rot13)("hello") },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("ignores query string query params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, simulateRequestAsync({
                        url: "".concat(VALID_URL, "?foo=bar"),
                        body: { text: "hello" },
                    })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 200,
                        value: { transformed: (0, rot13_1.rot13)("hello") },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("returns not found when the url is nor correct", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, simulateRequestAsync({
                        url: "/no-such-url",
                    })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 404,
                        value: { error: "Not found" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should give method not allowed when the method is not POST", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, simulateRequestAsync({
                        method: "GET",
                        url: VALID_URL,
                    })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 405,
                        value: { error: "Method not allowed" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should give bad request when content-type is not Json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { "Content-Type": "text/plain" };
                    return [4 /*yield*/, simulateRequestAsync({
                            headers: headers,
                            url: VALID_URL,
                        })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 405,
                        value: { error: "Invalid content type" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should give bad request when there is no headers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = {};
                    return [4 /*yield*/, simulateRequestAsync({
                            headers: headers,
                            url: VALID_URL,
                        })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 405,
                        value: { error: "Invalid content type" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should give bad request when json does not have text field", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, simulateRequestAsync({
                        body: { notText: "" },
                        url: VALID_URL,
                    })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 400,
                        value: { error: "Json must have text field" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("ignores extranous fields", function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = { wrongField: "foo", text: "right field" };
                    return [4 /*yield*/, simulateRequestAsync({
                            body: body,
                            url: VALID_URL,
                        })];
                case 1:
                    response = (_a.sent()).response;
                    expectResponseToEqual({
                        response: response,
                        status: 200,
                        value: { transformed: (0, rot13_1.rot13)("right field") },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    describe("Command-line processing", function () {
        it("should tell the user to provide an argument when the user do not", function () { return __awaiter(void 0, void 0, void 0, function () {
            var consume;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, startServerAsync([])];
                    case 1:
                        consume = (_a.sent()).consume;
                        expect(consume()).toEqual(["please provide an argument\n"]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should tell the user when he provide too much argument", function () { return __awaiter(void 0, void 0, void 0, function () {
            var consume;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, startServerAsync(["one", "two"])];
                    case 1:
                        consume = (_a.sent()).consume;
                        expect(consume()).toEqual(["please provide at most one argument\n"]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe("parsing", function () {
    it("should give bad request when json fails to parse", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, simulateRequestAsync({
                        body: "not-json",
                        url: VALID_URL,
                    })];
                case 1:
                    response = (_a.sent()).response;
                    expect(response).toEqual({
                        status: 400,
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: '{"error":"Unexpected token o in JSON at position 1"}',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
