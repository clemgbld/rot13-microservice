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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeServer = void 0;
var http_1 = __importDefault(require("http"));
var log_1 = require("../log");
var command_line_1 = require("../../../infrastructure/command-line");
var clock_1 = require("../../../infrastructure/clock");
var http_server_1 = require("../http-server");
var http_request_1 = require("../http-request");
var PORT = 3002;
var createLogger = function () {
    var fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
    var fakeClock = clock_1.clock.createNull({ now: 0 });
    return (0, log_1.log)(fakeCommandLine, fakeClock);
};
var createServer = function () {
    var logger = createLogger();
    var server = http_server_1.httpServer.create(logger);
    var outpouts = logger.trackOutput().outpouts;
    return { server: server, outpouts: outpouts };
};
var createFakeServer = function () {
    var logger = createLogger();
    var server = http_server_1.httpServer.createNull(logger);
    return server;
};
exports.createFakeServer = createFakeServer;
var startAsync = function (server, onRequestAsync) {
    if (onRequestAsync === void 0) { onRequestAsync = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    status: 200,
                    headers: {},
                    body: "",
                })];
        });
    }); }; }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.startAsync({ port: PORT, onRequestAsync: onRequestAsync })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); });
};
var stopAsync = function (server) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, server.stopAsync()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var startAndStopAsync = function (server) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, startAsync(server)];
            case 1:
                _a.sent();
                return [4 /*yield*/, stopAsync(server)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var finallyStartAndStopAsync = function (options, fnAysync) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, server, outpouts;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = createServer(), server = _a.server, outpouts = _a.outpouts;
                return [4 /*yield*/, startAsync(server, options)];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, , 4, 6]);
                return [4 /*yield*/, fnAysync(server, outpouts)];
            case 3: return [2 /*return*/, _b.sent()];
            case 4: return [4 /*yield*/, stopAsync(server)];
            case 5:
                _b.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
var getAsync = function (_a) {
    var onRequestAsync = _a.onRequestAsync;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, finallyStartAndStopAsync(onRequestAsync, function (_, outpouts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        var request = http_1.default.get({ port: PORT });
                                        request.on("response", function (response) {
                                            var body = "";
                                            response.on("data", function (data) {
                                                body += data;
                                            });
                                            response.on("error", function (err) { return reject(err); });
                                            response.on("end", function () {
                                                var headers = response.headers;
                                                delete headers.connection;
                                                delete headers["content-length"];
                                                delete headers.date;
                                                resolve({
                                                    response: {
                                                        status: response.statusCode,
                                                        body: body,
                                                        headers: headers,
                                                    },
                                                    outpouts: outpouts,
                                                });
                                            });
                                        });
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
describe("HTTP Server", function () {
    it("says when server is started", function () { return __awaiter(void 0, void 0, void 0, function () {
        var server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = createServer().server;
                    expect(server.isStarted()).toBe(false);
                    return [4 /*yield*/, startAsync(server)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 3, 5]);
                    expect(server.isStarted()).toBe(true);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, stopAsync(server)];
                case 4:
                    _a.sent();
                    expect(server.isStarted()).toBe(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it("fails gracefully when server has startup error", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, finallyStartAndStopAsync(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ status: 200, headers: {}, body: "" })];
                    }); }); }, function (_) { return __awaiter(void 0, void 0, void 0, function () {
                        var server;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    server = createServer().server;
                                    return [4 /*yield*/, expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, startAsync(server)];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        }); }); }).rejects.toThrowError(/^Couldn't start server due to error: listen EADDRINUSE:/)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("starts and stops the server (and should be able to do so multiple times)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = createServer().server;
                    return [4 /*yield*/, startAndStopAsync(server)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, startAndStopAsync(server)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("fails fast when server is started twice", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, finallyStartAndStopAsync(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ status: 200, headers: {}, body: "" })];
                    }); }); }, function (server) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, startAsync(server)];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }).rejects.toThrow("Server must be closed before being restared")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("requests and responses", function () {
        it("runs a function when a request is received and serves the results", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedResponse, onRequestAsync, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedResponse = {
                            status: 777,
                            body: "my-body",
                            headers: {
                                header1: "value1",
                                header2: "value2",
                            },
                        };
                        onRequestAsync = function (request) {
                            return expectedResponse;
                        };
                        return [4 /*yield*/, getAsync({ onRequestAsync: onRequestAsync })];
                    case 1:
                        response = (_a.sent()).response;
                        expect(response).toEqual(expectedResponse);
                        return [2 /*return*/];
                }
            });
        }); });
        it("simulates request", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedResponse, expectedRequest, actualRequest, onRequestAsync, server, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedResponse = {
                            status: 777,
                            body: "my-body",
                            headers: {
                                header1: "value1",
                                header2: "value2",
                            },
                        };
                        expectedRequest = http_request_1.httpRequest.createNull();
                        onRequestAsync = function (request) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                actualRequest = request;
                                return [2 /*return*/, expectedResponse];
                            });
                        }); };
                        server = (0, exports.createFakeServer)();
                        return [4 /*yield*/, startAsync(server, onRequestAsync)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, server.simulateRequest(expectedRequest)];
                    case 2:
                        response = _a.sent();
                        expect(response).toEqual(expectedResponse);
                        expect(actualRequest).toEqual(expectedRequest);
                        return [2 /*return*/];
                }
            });
        }); });
        it("fails fast when we simulate the request before starting the null server", function () { return __awaiter(void 0, void 0, void 0, function () {
            var server;
            return __generator(this, function (_a) {
                server = (0, exports.createFakeServer)();
                expect(function () { return server.simulateRequest(); }).rejects.toThrow("Could not simulate the request before starting the server");
                return [2 /*return*/];
            });
        }); });
        it("fails gracefully when request handler throw exception and log an emergency output", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRequestAsync, _a, response, outpouts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onRequestAsync = function () {
                            throw new Error("onRequestAsync error");
                        };
                        return [4 /*yield*/, getAsync({ onRequestAsync: onRequestAsync })];
                    case 1:
                        _a = _b.sent(), response = _a.response, outpouts = _a.outpouts;
                        expect(outpouts).toEqual([
                            {
                                alert: "emergency",
                                message: "request handler threw exception",
                                error: new Error("onRequestAsync error"),
                            },
                        ]);
                        expect(response).toEqual({
                            status: 500,
                            headers: { "content-type": "text/plain; charset=utf-8" },
                            body: "Internal Server Error: request handler threw exception",
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it("fails fast when server is stopped when it is not running", function () { return __awaiter(void 0, void 0, void 0, function () {
        var server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = createServer().server;
                    return [4 /*yield*/, expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, stopAsync(server)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }).rejects.toThrow("Can't stop server because it is not running")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("nullability", function () {
    it("does not actually start or stop the server", function () { return __awaiter(void 0, void 0, void 0, function () {
        var server, server2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = (0, exports.createFakeServer)();
                    server2 = (0, exports.createFakeServer)();
                    return [4 /*yield*/, startAsync(server)];
                case 1:
                    _a.sent();
                    expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, startAsync(server2)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); }).not.toThrow();
                    return [4 /*yield*/, stopAsync(server)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
