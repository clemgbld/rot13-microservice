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
exports.httpRequest = void 0;
var ramda_1 = require("ramda");
var buildInfrastructure_1 = require("../../infrastructure/utils/buildInfrastructure");
var events_1 = __importDefault(require("events"));
var withHttpRequest = function (dependencyHttpRequest) { return function (o) {
    var headers = Object.freeze(dependencyHttpRequest.headers);
    var ignoreParameters = function (contentType) {
        return contentType === null || contentType === void 0 ? void 0 : contentType.split(";")[0];
    };
    var normalizeContentType = function (contentType) {
        return contentType === null || contentType === void 0 ? void 0 : contentType.toLowerCase().trim();
    };
    var normalizeContentTypeFromHeaders = (0, ramda_1.pipe)(ignoreParameters, normalizeContentType);
    return __assign(__assign({}, o), { pathName: new URL(dependencyHttpRequest.url || "", "http://unknown.host")
            .pathname, method: dependencyHttpRequest.method, headers: headers, readBodyAsync: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            if (dependencyHttpRequest.readableEnded) {
                                throw new Error("Cannot read the body twice");
                            }
                            dependencyHttpRequest.on("error", reject);
                            var body = "";
                            dependencyHttpRequest.on("data", function (chunk) {
                                body += chunk;
                            });
                            dependencyHttpRequest.on("end", function () {
                                resolve(body);
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }, hasContentType: function (contentType) {
            return normalizeContentTypeFromHeaders(headers["content-type"]) ===
                normalizeContentType(contentType);
        } });
}; };
var normalizeHeaders = function (headers) {
    return Object.entries(headers).reduce(function (acc, _a) {
        var _b;
        var key = _a[0], value = _a[1];
        return (__assign(__assign({}, acc), (_b = {}, _b[key.toLowerCase()] = value, _b)));
    }, {});
};
var NullHttpRequest = /** @class */ (function (_super) {
    __extends(NullHttpRequest, _super);
    function NullHttpRequest(_a) {
        var _b = _a.url, url = _b === void 0 ? "/my-null-url" : _b, _c = _a.method, method = _c === void 0 ? "GET" : _c, _d = _a.headers, headers = _d === void 0 ? {} : _d, _e = _a.body, body = _e === void 0 ? "" : _e;
        var _this = _super.call(this) || this;
        _this.url = url;
        _this.method = method.toUpperCase();
        _this.headers = normalizeHeaders(headers);
        _this.readableEnded = false;
        _this.body = body;
        return _this;
    }
    NullHttpRequest.prototype.on = function (event, fn) {
        var _this = this;
        if (event === "data") {
            setImmediate(function () {
                fn(_this.body);
            });
        }
        if (event === "end") {
            setImmediate(function () {
                fn();
                _this.readableEnded = true;
            });
        }
        return this;
    };
    return NullHttpRequest;
}(events_1.default));
exports.httpRequest = {
    create: function (request) {
        return (0, buildInfrastructure_1.buildInfrastructure)({
            dependancy: request,
            infrastructureObj: exports.httpRequest,
            withMixin: withHttpRequest,
        });
    },
    createNull: function (configurableRequest) {
        if (configurableRequest === void 0) { configurableRequest = {}; }
        return (0, buildInfrastructure_1.buildInfrastructure)({
            dependancy: new NullHttpRequest(configurableRequest),
            infrastructureObj: exports.httpRequest,
            withMixin: withHttpRequest,
        });
    },
};
