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
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_1 = require("../../../infrastructure/command-line");
var clock_1 = require("../../../infrastructure/clock");
var log_1 = require("../log");
var http_server_1 = require("../http-server");
var helper_1 = require("../../../test-helper/helper");
var http_request_1 = require("../http-request");
var PORT = 3148;
var createRequestAsync = function (options, expectFnAsync) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var onRequestAsync, fakeCommandLine, fakeClock, logger, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onRequestAsync = function (request) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                                expectFnAsync(request);
                                return [2 /*return*/, { status: 200, headers: {}, body: "" }];
                            }
                            catch (err) {
                                reject(err);
                            }
                            return [2 /*return*/];
                        });
                    }); };
                    fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
                    fakeClock = clock_1.clock.createNull({ now: 0 });
                    logger = (0, log_1.log)(fakeCommandLine, fakeClock);
                    server = http_server_1.httpServer.create(logger);
                    return [4 /*yield*/, server.startAsync({
                            port: PORT,
                            onRequestAsync: onRequestAsync,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, helper_1.requestAsync)(__assign({ port: PORT }, options))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, server.stopAsync()];
                case 3:
                    _a.sent();
                    resolve("resolve");
                    return [2 /*return*/];
            }
        });
    }); });
};
describe("HTTP Request", function () {
    describe("Raw data", function () {
        it("provides the url", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createRequestAsync({
                            url: "/my-url",
                        }, function (request) { return expect(request.pathName).toBe("/my-url"); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("provides the pathName", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createRequestAsync({
                            url: "/my-url?foo=bar",
                        }, function (request) { return expect(request.pathName).toBe("/my-url"); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("provides the method (and normalized case)", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createRequestAsync({
                            method: "pOst",
                        }, function (request) { return expect(request.method).toBe("POST"); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("provides the headers (and normalized case)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = {
                            myHeaDer1: "myHeader1",
                            myHEader2: "myHeader2",
                        };
                        return [4 /*yield*/, createRequestAsync({ headers: headers }, function (request) {
                                expect(request.headers).toEqual({
                                    myheader1: "myHeader1",
                                    myheader2: "myHeader2",
                                    connection: "close",
                                    "content-length": "0",
                                    host: "localhost:".concat(PORT),
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should throw an error when trying to mutate the headers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = {
                            header: "value",
                        };
                        return [4 /*yield*/, createRequestAsync({ headers: headers }, function (request) {
                                try {
                                    delete request.headers.header;
                                }
                                catch (err) {
                                    expect(err.message).toBe("Cannot delete property 'header' of [object Object]");
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("provides body", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ["chunk1", "chunk2"];
                        return [4 /*yield*/, createRequestAsync({
                                body: body,
                            }, function (request) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = expect;
                                        return [4 /*yield*/, request.readBodyAsync()];
                                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()]).toBe("chunk1chunk2")];
                                }
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("fails fast when the body is read twice", function () { return __awaiter(void 0, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ["chunk1", "chunk2"];
                        return [4 /*yield*/, createRequestAsync({
                                body: body,
                            }, function (request) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, request.readBodyAsync()];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, request.readBodyAsync()];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                }); }); }).rejects.toThrowError("Cannot read the body twice")];
                                        case 2:
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
    });
    describe("cooked content type header", function () {
        var check = function (_a) {
            var _b;
            var _c = _a.contentType, contentType = _c === void 0 ? "application/json" : _c, _d = _a.mediaType, mediaType = _d === void 0 ? "application/json" : _d, _e = _a.expectedResult, expectedResult = _e === void 0 ? true : _e, _f = _a.contentTypeKey, contentTypeKey = _f === void 0 ? "content-type" : _f;
            var headers = (_b = {}, _b[contentTypeKey] = contentType, _b);
            var request = http_request_1.httpRequest.createNull({ headers: headers });
            expect(request.hasContentType(mediaType)).toBe(expectedResult);
        };
        it("checks if expected mediaty matchs contentype headers", function () {
            check({
                contentType: "application/json",
                mediaType: "application/json",
                expectedResult: true,
            });
        });
        it("checks that media type does not match ", function () {
            check({
                contentType: "text/plain",
                mediaType: "application/json",
                expectedResult: false,
            });
        });
        it("should be case insensitive when contentype is upperCase", function () {
            check({
                contentType: "APPLICATION/JSON",
                mediaType: "application/json",
                expectedResult: true,
            });
        });
        it("should be case insensitive when mediaType is upperCase", function () {
            check({
                contentType: "application/json",
                mediaType: "APPLICATION/JSON",
                expectedResult: true,
            });
        });
        it("should be false when there is no conetnt type", function () {
            check({
                contentType: "APPLICATION/JSON",
                mediaType: "application/json",
                expectedResult: false,
                contentTypeKey: "no",
            });
        });
        it("should ignores white spaces", function () {
            check({
                contentType: "  application/json  ",
                mediaType: "\tapplication/json\t",
                expectedResult: true,
            });
        });
        it("should ignore parameters", function () {
            check({
                contentType: "application/json;charset=utf-8;foo=bar",
                mediaType: "application/json",
                expectedResult: true,
            });
        });
    });
});
describe("nullability", function () {
    it("provides default values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    request = http_request_1.httpRequest.createNull({});
                    expect(request.pathName).toBe("/my-null-url");
                    expect(request.method).toBe("GET");
                    expect(request.headers).toEqual({});
                    _a = expect;
                    return [4 /*yield*/, request.readBodyAsync()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual("");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can configure the url", function () {
        var request = http_request_1.httpRequest.createNull({ url: "/my-url" });
        expect(request.pathName).toBe("/my-url");
    });
    it("can configure method (and normalize case)", function () {
        var request = http_request_1.httpRequest.createNull({ method: "pOst" });
        expect(request.method).toBe("POST");
    });
    it("can configure headers (and normalize case)", function () {
        var request = http_request_1.httpRequest.createNull({
            headers: {
                mYHeader1: "myvalue1",
                MYheader2: "myvalue2",
            },
        });
        expect(request.headers).toEqual({
            myheader1: "myvalue1",
            myheader2: "myvalue2",
        });
    });
    it("can configure the body", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    request = http_request_1.httpRequest.createNull({ body: "my body" });
                    _a = expect;
                    return [4 /*yield*/, request.readBodyAsync()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe("my body");
                    return [2 /*return*/];
            }
        });
    }); });
    it("fails fast when body is read twice", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = http_request_1.httpRequest.createNull({});
                    return [4 /*yield*/, request.readBodyAsync()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, request.readBodyAsync()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }).rejects.toThrowError("Cannot read the body twice")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
