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
exports.httpServer = void 0;
const http_1 = __importDefault(require("http"));
const httpServer = () => {
    let server;
    return {
        create: function () {
            return this;
        },
        startAsync: ({ port }) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (server !== undefined) {
                    throw new Error("Server must be closed before being restared");
                }
                server = http_1.default.createServer();
                server.on("listening", resolve);
                server.listen(port);
            });
        }),
        stopAsync: () => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => {
                server.on("close", resolve);
                server.close();
            });
        }),
    };
};
exports.httpServer = httpServer;
