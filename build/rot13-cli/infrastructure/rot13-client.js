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
exports.createRot13Client = void 0;
var events_1 = __importDefault(require("events"));
var ramda_1 = require("ramda");
var trackOutput_1 = require("../../infrastructure/utils/trackOutput");
var HOST = "localhost";
var REQUEST_EVENT = "REQUEST_EVENT";
var responseErrorBuilder = function (_a) {
    var res = _a.res, port = _a.port;
    return function (message) {
        throw new Error("".concat(message, "\nHost:").concat(HOST, ":").concat(port, "\nStatus: ").concat(res.status, "\nHeaders: ").concat(JSON.stringify(res.headers), "\nBody: ").concat(res.body));
    };
};
var validateResponse = function (_a) {
    var port = _a.port, res = _a.res;
    var throwResponseError = responseErrorBuilder({ port: port, res: res });
    if (res.status !== 200)
        throwResponseError("Unexpected status from ROT 13 service");
    if (res.body === "")
        throwResponseError("Body missing from ROT-13 service");
    return {
        throwResponseError: throwResponseError,
        body: res.body,
    };
};
var parseBody = function (_a) {
    var throwResponseError = _a.throwResponseError, body = _a.body;
    try {
        var parsedBody = JSON.parse(body).transformed;
        if (typeof parsedBody !== "string")
            throwResponseError("Unexpected body type from Rot-13 service: expected string but received ".concat(typeof parsedBody));
        return parsedBody;
    }
    catch (_b) {
        var message = _b.message;
        throwResponseError("Unparsable body from ROT-13 service: ".concat(message));
    }
};
var validateAndParseResponse = (0, ramda_1.pipe)(validateResponse, parseBody);
var createRot13Client = function (client) {
    var emitter = new events_1.default();
    return {
        transformAsync: function (port, textToTransform) { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.requestAsync({
                            host: HOST,
                            port: port,
                            path: "/rot-13/transform",
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ text: textToTransform }),
                        })];
                    case 1:
                        res = _a.sent();
                        emitter.emit(REQUEST_EVENT, {
                            port: port,
                            text: textToTransform,
                        });
                        return [2 /*return*/, validateAndParseResponse({ port: port, res: res })];
                }
            });
        }); },
        trackRequests: function () { return (0, trackOutput_1.trackOutput)(emitter, REQUEST_EVENT); },
    };
};
exports.createRot13Client = createRot13Client;
