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
exports.httpClient = void 0;
var http_1 = __importDefault(require("http"));
var events_1 = __importDefault(require("events"));
var trackOutput_1 = require("../../infrastructure/utils/trackOutput");
var REQUEST_EVENT = "REQUEST_EVENT";
var NullResponse = /** @class */ (function (_super) {
    __extends(NullResponse, _super);
    function NullResponse(_res) {
        if (_res === void 0) { _res = { status: 503, body: "" }; }
        var _this = _super.call(this) || this;
        _this._res = _res;
        setImmediate(function () {
            _this.emit("data", _this._res.body);
            _this.emit("end");
        });
        return _this;
    }
    Object.defineProperty(NullResponse.prototype, "statusCode", {
        get: function () {
            return this._res.status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NullResponse.prototype, "headers", {
        get: function () {
            return this._res.headers;
        },
        enumerable: false,
        configurable: true
    });
    return NullResponse;
}(events_1.default));
var NullRequest = /** @class */ (function (_super) {
    __extends(NullRequest, _super);
    function NullRequest(_res) {
        if (_res === void 0) { _res = []; }
        var _this = _super.call(this) || this;
        _this._res = _res;
        return _this;
    }
    NullRequest.prototype.end = function (_) {
        var _this = this;
        setImmediate(function () {
            _this.emit("response", new NullResponse(_this._res.shift()));
        });
        return this;
    };
    return NullRequest;
}(events_1.default));
var nullHttp = function (res) { return ({
    request: function (_a) {
        var path = _a.path;
        return new NullRequest(res[path]);
    },
}); };
var normalizeHeaders = function (headers) {
    return Object.entries(headers).reduce(function (acc, _a) {
        var _b;
        var key = _a[0], value = _a[1];
        return (__assign(__assign({}, acc), (_b = {}, _b[key.toLowerCase()] = value, _b)));
    }, {});
};
var withHttpClient = function (http) {
    var emitter = new events_1.default();
    return {
        requestAsync: function (_a) {
            var host = _a.host, port = _a.port, method = _a.method, _b = _a.headers, headers = _b === void 0 ? {} : _b, path = _a.path, _c = _a.body, body = _c === void 0 ? "" : _c;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var request = http.request({
                                    host: host,
                                    port: port,
                                    method: method,
                                    headers: headers,
                                    path: path,
                                    body: body,
                                });
                                emitter.emit(REQUEST_EVENT, {
                                    host: host,
                                    port: port,
                                    method: method.toUpperCase(),
                                    headers: normalizeHeaders(headers),
                                    path: path,
                                    body: body,
                                });
                                request.on("response", function (res) {
                                    var headers = __assign({}, res.headers);
                                    delete headers.connection;
                                    delete headers["content-length"];
                                    delete headers.host;
                                    delete headers.date;
                                    var body = "";
                                    res.on("data", function (chunk) {
                                        if (chunk === void 0) { chunk = ""; }
                                        body += chunk;
                                    });
                                    res.on("end", function () {
                                        resolve({ status: res.statusCode, headers: headers, body: body });
                                    });
                                });
                                request.end(body);
                            })];
                        case 1: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
        trackRequests: function () { return (0, trackOutput_1.trackOutput)(emitter, REQUEST_EVENT); },
    };
};
exports.httpClient = {
    create: function () { return withHttpClient(http_1.default); },
    createNull: function (responses) {
        if (responses === void 0) { responses = {
            "/my-path": [
                {
                    status: 503,
                    body: "Null http client response",
                    headers: { NullHttpClient: "default-header" },
                },
            ],
        }; }
        return withHttpClient(nullHttp(responses));
    },
};
