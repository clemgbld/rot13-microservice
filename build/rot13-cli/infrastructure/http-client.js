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
            if (!_this._res.hang)
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
    NullRequest.prototype.abort = function () { };
    NullRequest.prototype.destroy = function (rejectPromise) { };
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
    var cancelFn;
    return {
        request: function (_a) {
            var host = _a.host, port = _a.port, method = _a.method, _b = _a.headers, headers = _b === void 0 ? {} : _b, path = _a.path, _c = _a.body, body = _c === void 0 ? "" : _c;
            var responsePromise = new Promise(function (resolve, reject) {
                var request = http.request({
                    host: host,
                    port: port,
                    method: method,
                    headers: headers,
                    path: path,
                    body: body,
                });
                var cancellable = true;
                var requestData = {
                    host: host,
                    port: port,
                    method: method.toUpperCase(),
                    headers: normalizeHeaders(headers),
                    path: path,
                    body: body,
                };
                cancelFn = function (message) {
                    if (!cancellable)
                        return false;
                    request.abort();
                    request.destroy(reject(new Error(message)));
                    cancellable = false;
                    emitter.emit(REQUEST_EVENT, __assign(__assign({}, requestData), { cancelled: true }));
                    return true;
                };
                emitter.emit(REQUEST_EVENT, requestData);
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
                        cancellable = false;
                        resolve({ status: res.statusCode, headers: headers, body: body });
                    });
                });
                request.end(body);
            });
            return { responsePromise: responsePromise, cancelFn: cancelFn };
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
