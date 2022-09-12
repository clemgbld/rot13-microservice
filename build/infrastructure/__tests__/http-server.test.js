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
Object.defineProperty(exports, "__esModule", { value: true });
const http_server_1 = require("../http-server");
const PORT = 5001;
describe("HTTP Server", () => {
    it("starts and stops the server", () => __awaiter(void 0, void 0, void 0, function* () {
        const server = (0, http_server_1.httpServer)().create();
        yield server.startAsync({ port: PORT });
        yield server.stopAsync();
    }));
    it.only("fails fast if server is started twice", () => __awaiter(void 0, void 0, void 0, function* () {
        const server = (0, http_server_1.httpServer)().create();
        yield server.startAsync({ port: 5003 });
        try {
            expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield server.startAsync({ port: 7003 }); })).toThrow("Server must be closed before being restared");
        }
        finally {
            yield server.stopAsync();
        }
    }));
});
