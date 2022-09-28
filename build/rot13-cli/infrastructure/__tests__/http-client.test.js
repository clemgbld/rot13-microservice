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
var http_1 = __importDefault(require("http"));
var http_client_1 = require("../http-client");
var HOST = "localhost";
var PORT = 3274;
var createSpyServer = function () {
    var server = http_1.default.createServer();
    var lastRequest;
    var nextResponse;
    return {
        startAsync: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        server.once("listening", function () {
                            resolve("resolve");
                        });
                        server.on("request", function (req, res) {
                            var body = "";
                            req.on("data", function (chunk) {
                                body += chunk;
                            });
                            req.on("end", function () {
                                var headers = __assign({}, req.headers);
                                delete headers.connection;
                                delete headers["content-length"];
                                delete headers.host;
                                lastRequest = {
                                    path: req.url,
                                    method: req.method,
                                    headers: headers,
                                    body: body,
                                };
                                res.statusCode = nextResponse.status;
                                Object.entries(nextResponse.headers).forEach(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    res.setHeader(key, value);
                                });
                                res.end(nextResponse.body);
                            });
                        });
                        server.listen(PORT);
                    })];
            });
        }); },
        stopAsync: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        server.once("close", function () { return resolve("close"); });
                        server.close();
                    })];
            });
        }); },
        getLastRequest: function () { return lastRequest; },
        setResponse: function (response) {
            nextResponse = response;
        },
        reset: function () {
            lastRequest = null;
            nextResponse = {
                status: 500,
                headers: { header: "header not specci" },
                body: "no body specified yet",
            };
        },
    };
};
describe("HTTP client", function () {
    var server;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = createSpyServer();
                    return [4 /*yield*/, server.startAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        server.reset();
    });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server.stopAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("Real implementation", function () {
        it("performs request and returns a response", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = http_client_1.httpClient.create();
                        server.setResponse({
                            status: 999,
                            headers: { myRequestHeader: "my value" },
                            body: "my-body",
                        });
                        return [4 /*yield*/, client.requestAsync({
                                host: HOST,
                                port: PORT,
                                method: "POST",
                                headers: { myRequestHeader: "my value" },
                                path: "/my-path",
                                body: "my-body",
                            })];
                    case 1:
                        response = _a.sent();
                        expect(server.getLastRequest()).toEqual({
                            method: "POST",
                            headers: { myrequestheader: "my value" },
                            path: "/my-path",
                            body: "my-body",
                        });
                        expect(response).toEqual({
                            status: 999,
                            headers: { myrequestheader: "my value" },
                            body: "my-body",
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it("does not require headers and body", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = http_client_1.httpClient.create();
                        return [4 /*yield*/, client.requestAsync({
                                host: HOST,
                                port: PORT,
                                method: "GET",
                                path: "/my-path",
                            })];
                    case 1:
                        _a.sent();
                        expect(server.getLastRequest()).toEqual({
                            method: "GET",
                            path: "/my-path",
                            headers: {},
                            body: "",
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("nullability", function () {
        var IRELEVENAT_REQUEST = {
            host: HOST,
            port: PORT,
            method: "GET",
            path: "/my-path",
        };
        it("does not talk to network", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = http_client_1.httpClient.createNull();
                        return [4 /*yield*/, client.requestAsync(IRELEVENAT_REQUEST)];
                    case 1:
                        _a.sent();
                        expect(server.getLastRequest()).toBe(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it("provides a default response", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = http_client_1.httpClient.createNull();
                        return [4 /*yield*/, client.requestAsync(IRELEVENAT_REQUEST)];
                    case 1:
                        response = _a.sent();
                        expect(response).toEqual({
                            status: 503,
                            headers: { NullHttpClient: "default-header" },
                            body: "Null http client response",
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it("provides multiple responses from multiple endpoints", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, response1A, response1B, response2A;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = http_client_1.httpClient.createNull({
                            "/endpoint/1": [
                                { status: 200, headers: { myHeader: "my value" }, body: "body" },
                                { status: 404, body: "" },
                            ],
                            "/endpoint/2": [{ status: 301, body: "endpoint 2 body" }],
                        });
                        return [4 /*yield*/, client.requestAsync({
                                host: HOST,
                                port: PORT,
                                method: "GET",
                                path: "/endpoint/1",
                            })];
                    case 1:
                        response1A = _a.sent();
                        return [4 /*yield*/, client.requestAsync({
                                host: HOST,
                                port: PORT,
                                method: "GET",
                                path: "/endpoint/1",
                            })];
                    case 2:
                        response1B = _a.sent();
                        return [4 /*yield*/, client.requestAsync({
                                host: HOST,
                                port: PORT,
                                method: "GET",
                                path: "/endpoint/2",
                            })];
                    case 3:
                        response2A = _a.sent();
                        expect(response1A).toEqual({
                            status: 200,
                            headers: { myHeader: "my value" },
                            body: "body",
                        });
                        expect(response1B).toEqual({
                            status: 404,
                            headers: {},
                            body: "",
                        });
                        expect(response2A).toEqual({
                            status: 301,
                            body: "endpoint 2 body",
                            headers: {},
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it("tracks request", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = http_client_1.httpClient.createNull();
                        requests = client.trackRequests().outpouts;
                        return [4 /*yield*/, client.requestAsync({
                                host: HOST,
                                port: PORT,
                                method: "post",
                                headers: { myHeAders: "my value" },
                                body: "my body",
                                path: "/my-path",
                            })];
                    case 1:
                        _a.sent();
                        expect(requests).toEqual([
                            {
                                body: "my body",
                                host: HOST,
                                port: PORT,
                                method: "POST",
                                headers: { myheaders: "my value" },
                                path: "/my-path",
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
