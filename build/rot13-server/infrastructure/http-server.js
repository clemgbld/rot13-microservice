"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.httpServer = void 0;
var events_1 = __importDefault(require("events"));
var http_1 = __importDefault(require("http"));
var http_request_1 = require("./http-request");
var buildInfrastructure_1 = require("../../infrastructure/utils/buildInfrastructure");
var NullNodeServer = /** @class */ (function (_super) {
    __extends(NullNodeServer, _super);
    function NullNodeServer() {
        return _super.call(this) || this;
    }
    NullNodeServer.prototype.listen = function () {
        var _this = this;
        setImmediate(function () { return _this.emit("listening"); });
    };
    NullNodeServer.prototype.close = function () {
        var _this = this;
        setImmediate(function () { return _this.emit("close"); });
    };
    return NullNodeServer;
}(events_1.default));
var nullHttp = {
    createServer: function () { return new NullNodeServer(); },
};
var handleRequestAsync = function (request, onRequestAsync, log) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, onRequestAsync(request)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
            case 2:
                error_1 = _a.sent();
                log.emergency({
                    message: "request handler threw exception",
                    error: error_1,
                });
                return [2 /*return*/, {
                        status: 500,
                        headers: { "content-type": "text/plain; charset=utf-8" },
                        body: "Internal Server Error: request handler threw exception",
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
var withHttpServer = function (_a) {
    var http = _a.http, log = _a.log;
    return function (o) {
        var fakeOnRequestAsync;
        var server;
        return __assign(__assign({}, o), { isStarted: function () { return server !== undefined; }, startAsync: function (_a) {
                var port = _a.port, onRequestAsync = _a.onRequestAsync;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                if (server !== undefined) {
                                    throw new Error("Server must be closed before being restared");
                                }
                                fakeOnRequestAsync = onRequestAsync;
                                server = http.createServer();
                                server.on("error", function (err) {
                                    reject(new Error("Couldn't start server due to error: ".concat(err.message)));
                                });
                                server.on("request", function (nodeRequest, nodeResponse) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a, _b, status, _c, body, _d, headers;
                                    return __generator(this, function (_e) {
                                        switch (_e.label) {
                                            case 0: return [4 /*yield*/, handleRequestAsync(http_request_1.httpRequest.create(nodeRequest), onRequestAsync, log)];
                                            case 1:
                                                _a = _e.sent(), _b = _a.status, status = _b === void 0 ? 501 : _b, _c = _a.body, body = _c === void 0 ? "" : _c, _d = _a.headers, headers = _d === void 0 ? {} : _d;
                                                nodeResponse.statusCode = status;
                                                Object.entries(headers).forEach(function (_a) {
                                                    var name = _a[0], _b = _a[1], value = _b === void 0 ? "" : _b;
                                                    return nodeResponse.setHeader(name, value);
                                                });
                                                nodeResponse.end(body);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                server.on("listening", resolve);
                                server.listen(port);
                            })];
                    });
                });
            }, stopAsync: function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            if (!server) {
                                throw new Error("Can't stop server because it is not running");
                            }
                            server.on("close", resolve);
                            server.close();
                            server = undefined;
                        })];
                });
            }); }, simulateRequest: function (request) {
                if (request === void 0) { request = http_request_1.httpRequest.createNull(); }
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!fakeOnRequestAsync) {
                            throw new Error("Could not simulate the request before starting the server");
                        }
                        return [2 /*return*/, handleRequestAsync(request, fakeOnRequestAsync, log)];
                    });
                });
            } });
    };
};
exports.httpServer = {
    create: function (log) {
        return (0, buildInfrastructure_1.buildInfrastructure)({
            dependancy: { http: http_1.default, log: log },
            infrastructureObj: exports.httpServer,
            withMixin: withHttpServer,
        });
    },
    createNull: function (log) {
        return (0, buildInfrastructure_1.buildInfrastructure)({
            dependancy: { http: nullHttp, log: log },
            infrastructureObj: exports.httpServer,
            withMixin: withHttpServer,
        });
    },
};
