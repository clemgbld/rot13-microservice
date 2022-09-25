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
exports.createFakeServer = void 0;
const http_server_1 = require("../../infrastructure/http-server");
const command_line_1 = require("../../infrastructure/command-line");
const clock_1 = require("../../infrastructure/clock");
const log_1 = require("../../infrastructure/log");
const http_request_1 = require("../../infrastructure/http-request");
const rot13_1 = require("../../core/rot13");
const rot13_server_1 = require("../rot13-server");
const createLogger = () => {
    const fakeCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)());
    const fakeClock = clock_1.clock.createNull({ now: 0 });
    return (0, log_1.log)(fakeCommandLine, fakeClock);
};
const createFakeServer = () => {
    const logger = createLogger();
    const server = http_server_1.httpServer.createNull(logger);
    return server;
};
exports.createFakeServer = createFakeServer;
const startServerAsync = (args = ["5000"]) => __awaiter(void 0, void 0, void 0, function* () {
    const nullCommandLine = (0, command_line_1.commandLine)((0, command_line_1.nullProcess)(args));
    const nullHttpServer = (0, exports.createFakeServer)();
    const { consume } = nullCommandLine.trackStdout();
    const myApp = (0, rot13_server_1.app)(nullCommandLine, nullHttpServer);
    yield myApp.startAsync();
    return { nullHttpServer, consume };
});
const VALID_URL = "/rot-13/transform";
const VALID_METHOD = "POST";
const simulateRequestAsync = ({ url = VALID_URL, body = { text: "" }, method = VALID_METHOD, headers = { "content-type": "application/json;charset=utf-8" }, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { consume, nullHttpServer } = yield startServerAsync();
    consume();
    const request = http_request_1.httpRequest.createNull({
        url,
        body: typeof body === "object" ? JSON.stringify(body) : body,
        method,
        headers,
    });
    const response = yield nullHttpServer.simulateRequest(request);
    return { consume, response };
});
const expectResponseToEqual = ({ status, value, response, }) => expect(response).toEqual({
    status,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(value),
});
describe("ROT13-Server", () => {
    it("starts the server", () => __awaiter(void 0, void 0, void 0, function* () {
        const { consume, nullHttpServer } = yield startServerAsync(["5000"]);
        expect(nullHttpServer.isStarted()).toBe(true);
        expect(consume()).toEqual(["Server started on port 5000\n"]);
    }));
    it("logs 'Recieved request' to the command-line when request is received", () => __awaiter(void 0, void 0, void 0, function* () {
        const { consume } = yield simulateRequestAsync({});
        expect(consume()).toEqual(["Recevied request\n"]);
    }));
    it("transforms request", () => __awaiter(void 0, void 0, void 0, function* () {
        const { response } = yield simulateRequestAsync({
            url: VALID_URL,
            body: { text: "hello" },
        });
        expectResponseToEqual({
            response,
            status: 200,
            value: { transformed: (0, rot13_1.rot13)("hello") },
        });
    }));
    it("ignores query string query params", () => __awaiter(void 0, void 0, void 0, function* () {
        const { response } = yield simulateRequestAsync({
            url: `${VALID_URL}?foo=bar`,
            body: { text: "hello" },
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
            url: VALID_URL,
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
            url: VALID_URL,
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
            url: VALID_URL,
        });
        expectResponseToEqual({
            response,
            status: 405,
            value: { error: "Invalid content type" },
        });
    }));
    it("should give bad request when json does not have text field", () => __awaiter(void 0, void 0, void 0, function* () {
        const { response } = yield simulateRequestAsync({
            body: { notText: "" },
            url: VALID_URL,
        });
        expectResponseToEqual({
            response,
            status: 400,
            value: { error: "Json must have text field" },
        });
    }));
    it("ignores extranous fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = { wrongField: "foo", text: "right field" };
        const { response } = yield simulateRequestAsync({
            body,
            url: VALID_URL,
        });
        expectResponseToEqual({
            response,
            status: 200,
            value: { transformed: (0, rot13_1.rot13)("right field") },
        });
    }));
    describe("Command-line processing", () => {
        it("should tell the user to provide an argument when the user do not", () => __awaiter(void 0, void 0, void 0, function* () {
            const { consume } = yield startServerAsync([]);
            expect(consume()).toEqual(["please provide an argument\n"]);
        }));
        it("should tell the user when he provide too much argument", () => __awaiter(void 0, void 0, void 0, function* () {
            const { consume } = yield startServerAsync(["one", "two"]);
            expect(consume()).toEqual(["please provide at most one argument\n"]);
        }));
    });
});
describe("parsing", () => {
    it("should give bad request when json fails to parse", () => __awaiter(void 0, void 0, void 0, function* () {
        const { response } = yield simulateRequestAsync({
            body: "not-json",
            url: VALID_URL,
        });
        expect(response).toEqual({
            status: 400,
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: '{"error":"Unexpected token o in JSON at position 1"}',
        });
    }));
});
