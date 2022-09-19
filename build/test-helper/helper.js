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
exports.requestAsync = void 0;
const http_1 = __importDefault(require("http"));
const requestAsync = ({ port, url, method, headers, body, }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        if (method === undefined && (body === null || body === void 0 ? void 0 : body.length) !== 0)
            method = "POST";
        const request = http_1.default.request({ port, path: url, method, headers });
        body === null || body === void 0 ? void 0 : body.forEach((chunk) => request.write(chunk));
        request.end();
        request.on("response", (response) => {
            let body = "";
            response.on("data", (chunk) => {
                body += chunk;
            });
            response.on("error", (err) => reject(err));
            response.on("end", () => {
                const headers = response.headers;
                delete headers.connection;
                delete headers["content-length"];
                delete headers.date;
                resolve({
                    status: response.statusCode,
                    headers: response.headers,
                    body,
                });
            });
        });
    });
});
exports.requestAsync = requestAsync;
