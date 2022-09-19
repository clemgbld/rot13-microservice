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
const command_line_1 = require("../../infrastructure/command-line");
const http_server_1 = require("../../infrastructure/http-server");
const http_request_1 = require("../../infrastructure/http-request");
const rot13_1 = require("../../core/rot13");
const rot13_server_1 = require("../rot13-server");
const startServerAsync = (args = ["5000"]) => __awaiter(void 0, void 0, void 0, function* () {
    const nullCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(args));
    const nullHttpServer = http_server_1.httpServer.createNull();
    const myApp = (0, rot13_server_1.app)(nullCommandLine, nullHttpServer);
    yield myApp.startAsync();
    return { nullCommandLine, nullHttpServer };
});
const VALID_URL = "rot-13/transform";
const VALID_METHOD = "POST";
const simulateRequestAsync = ({ url = VALID_URL, body = "irelevant", method = VALID_METHOD, headers = { "Content-Type": "application/json;charset=utf-8" }, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { nullCommandLine, nullHttpServer } = yield startServerAsync();
    const request = http_request_1.httpRequest.createNull({
        url,
        body,
        method,
        headers,
    });
    const response = yield nullHttpServer.simulateRequest(request);
    return { nullCommandLine, response };
});
const expectResponseToEqual = ({ status, value, response, }) => expect(response).toEqual({
    status,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(value),
});
describe("ROT13-Server", () => {
    it("starts the server", () => __awaiter(void 0, void 0, void 0, function* () {
        const { nullCommandLine, nullHttpServer } = yield startServerAsync([
            "5000",
        ]);
        expect(nullHttpServer.isStarted()).toBe(true);
        expect(nullCommandLine.getLastOutpout()).toBe("Server started on port 5000\n");
    }));
    it("logs 'Recieved request' to the command-line when request is received", () => __awaiter(void 0, void 0, void 0, function* () {
        const { nullCommandLine } = yield simulateRequestAsync({});
        expect(nullCommandLine.getLastOutpout()).toBe("Recevied request\n");
    }));
    it("transforms request", () => __awaiter(void 0, void 0, void 0, function* () {
        const { response } = yield simulateRequestAsync({
            url: VALID_URL,
            body: "hello",
        });
        expectResponseToEqual({
            response,
            status: 200,
            value: { transformed: (0, rot13_1.rot13)("hello") },
        });
    }));
    it("returns not found when the url is nor correct", () => __awaiter(void 0, void 0, void 0, function* () {
        const { response } = yield simulateRequestAsync({
            url: "/no-such-url",
        });
        expectResponseToEqual({
            response,
            status: 404,
            value: { error: "Not found" },
        });
    }));
    it("should give method not allowed when the method is not POST", () => __awaiter(void 0, void 0, void 0, function* () {
        const { response } = yield simulateRequestAsync({
            method: "GET",
        });
        expectResponseToEqual({
            response,
            status: 405,
            value: { error: "Method not allowed" },
        });
    }));
    it("should give bad request when content-type is not Json", () => __awaiter(void 0, void 0, void 0, function* () {
        const headers = { "Content-Type": "text/plain" };
        const { response } = yield simulateRequestAsync({
            headers,
        });
        expectResponseToEqual({
            response,
            status: 405,
            value: { error: "Invalid content type" },
        });
    }));
    it("should give bad request when there is no headers", () => __awaiter(void 0, void 0, void 0, function* () {
        const headers = {};
        const { response } = yield simulateRequestAsync({
            headers,
        });
        expectResponseToEqual({
            response,
            status: 405,
            value: { error: "Invalid content type" },
        });
    }));
    describe("Command-line processing", () => {
        it("should tell the user to provide an argument when the user do not", () => __awaiter(void 0, void 0, void 0, function* () {
            const { nullCommandLine } = yield startServerAsync([]);
            expect(nullCommandLine.getLastOutpout()).toBe("please provide an argument\n");
        }));
        it("should tell the user when he provide tto much argument", () => __awaiter(void 0, void 0, void 0, function* () {
            const { nullCommandLine } = yield startServerAsync(["one", "two"]);
            expect(nullCommandLine.getLastOutpout()).toBe("please provide at most one argument\n");
        }));
    });
});
