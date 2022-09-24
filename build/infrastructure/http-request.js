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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = void 0;
const ramda_1 = require("ramda");
const buildInfrastructure_1 = require("./utils/buildInfrastructure");
const events_1 = __importDefault(require("events"));
const withHttpRequest = (dependencyHttpRequest) => (o) => {
    let headers = Object.freeze(dependencyHttpRequest.headers);
    const ignoreParameters = (contentType) => contentType === null || contentType === void 0 ? void 0 : contentType.split(";")[0];
    const normalizeContentType = (contentType) => contentType === null || contentType === void 0 ? void 0 : contentType.toLowerCase().trim();
    const normalizeContentTypeFromHeaders = (0, ramda_1.pipe)(ignoreParameters, normalizeContentType);
    return Object.assign(Object.assign({}, o), { pathName: new URL(dependencyHttpRequest.url || "", "http://unknown.host")
            .pathname, method: dependencyHttpRequest.method, headers, readBodyAsync: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (dependencyHttpRequest.readableEnded) {
                    throw new Error("Cannot read the body twice");
                }
                dependencyHttpRequest.on("error", reject);
                let body = "";
                dependencyHttpRequest.on("data", (chunk) => {
                    body += chunk;
                });
                dependencyHttpRequest.on("end", () => {
                    resolve(body);
                });
            });
        }), hasContentType: (contentType) => normalizeContentTypeFromHeaders(headers["content-type"]) ===
            normalizeContentType(contentType) });
};
const normalizeHeaders = (headers) => Object.entries(headers).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key.toLowerCase()]: value })), {});
class NullHttpRequest extends events_1.default {
    constructor({ url = "/my-null-url", method = "GET", headers = {}, body = "", }) {
        super();
        this.url = url;
        this.method = method.toUpperCase();
        this.headers = normalizeHeaders(headers);
        this.readableEnded = false;
        this.body = body;
    }
    on(event, fn) {
        if (event === "data") {
            setImmediate(() => {
                fn(this.body);
            });
        }
        if (event === "end") {
            setImmediate(() => {
                fn();
                this.readableEnded = true;
            });
        }
        return this;
    }
}
exports.httpRequest = {
    create: (request) => (0, buildInfrastructure_1.buildInfrastructure)({
        dependancy: request,
        infrastructureObj: exports.httpRequest,
        withMixin: withHttpRequest,
    }),
    createNull: (configurableRequest = {}) => (0, buildInfrastructure_1.buildInfrastructure)({
        dependancy: new NullHttpRequest(configurableRequest),
        infrastructureObj: exports.httpRequest,
        withMixin: withHttpRequest,
    }),
};
