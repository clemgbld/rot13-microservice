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
const http_1 = __importDefault(require("http"));
const http_server_1 = require("../http-server");
const http_request_1 = require("../http-request");
const PORT = 5537;
const startAsync = (server, onRequestAsync = () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        status: 200,
        headers: {},
        body: "",
    });
})) => __awaiter(void 0, void 0, void 0, function* () { return yield server.startAsync({ port: PORT, onRequestAsync }); });
const stopAsync = (server) => __awaiter(void 0, void 0, void 0, function* () { return yield server.stopAsync(); });
const startAndStopAsync = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield startAsync(server);
    yield stopAsync(server);
});
const finallyStartAndStopAsync = (options, fnAysync) => __awaiter(void 0, void 0, void 0, function* () {
    const server = http_server_1.httpServer.create();
    yield startAsync(server, options);
    try {
        return yield fnAysync(server);
    }
    finally {
        yield stopAsync(server);
    }
});
const getAsync = ({ onRequestAsync }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield finallyStartAndStopAsync(onRequestAsync, () => __awaiter(void 0, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            const request = http_1.default.get({ port: PORT });
            request.on("response", (response) => {
                let body = "";
                response.on("data", (data) => {
                    body += data;
                });
                response.on("error", (err) => reject(err));
                response.on("end", () => {
                    const headers = response.headers;
                    delete headers.connection;
                    delete headers["content-length"];
                    delete headers.date;
                    resolve({
                        status: response.statusCode,
                        body,
                        headers: headers,
                    });
                });
            });
        });
    }));
});
describe("HTTP Server", () => {
    it("says when server is started", () => __awaiter(void 0, void 0, void 0, function* () {
        const server = http_server_1.httpServer.create();
        expect(server.isStarted()).toBe(false);
        yield startAsync(server);
        try {
            expect(server.isStarted()).toBe(true);
        }
        finally {
            yield stopAsync(server);
            expect(server.isStarted()).toBe(false);
        }
    }));
    it("fails gracefully when server has startup error", () => __awaiter(void 0, void 0, void 0, function* () {
        yield finallyStartAndStopAsync(() => __awaiter(void 0, void 0, void 0, function* () { return ({ status: 200, headers: {}, body: "" }); }), (_) => __awaiter(void 0, void 0, void 0, function* () {
            const server = http_server_1.httpServer.create();
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield startAsync(server); })).rejects.toThrowError(/^Couldn't start server due to error: listen EADDRINUSE:/);
        }));
    }));
    it("starts and stops the server (and should be able to do so multiple times)", () => __awaiter(void 0, void 0, void 0, function* () {
        const server = http_server_1.httpServer.create();
        yield startAndStopAsync(server);
        yield startAndStopAsync(server);
    }));
    it("fails fast when server is started twice", () => __awaiter(void 0, void 0, void 0, function* () {
        yield finallyStartAndStopAsync(() => __awaiter(void 0, void 0, void 0, function* () { return ({ status: 200, headers: {}, body: "" }); }), (server) => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield startAsync(server); })).rejects.toThrow("Server must be closed before being restared");
        }));
    }));
    describe("requests and responses", () => {
        it("runs a function when a request is received and serves the results", () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedResponse = {
                status: 777,
                body: "my-body",
                headers: {
                    header1: "value1",
                    header2: "value2",
                },
            };
            const onRequestAsync = (request) => {
                return expectedResponse;
            };
            const response = yield getAsync({ onRequestAsync });
            expect(response).toEqual(expectedResponse);
        }));
        it("simulates request", () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedResponse = {
                status: 777,
                body: "my-body",
                headers: {
                    header1: "value1",
                    header2: "value2",
                },
            };
            const expectedRequest = http_request_1.httpRequest.createNull();
            var actualRequest;
            const onRequestAsync = (request) => __awaiter(void 0, void 0, void 0, function* () {
                actualRequest = request;
                return expectedResponse;
            });
            const server = http_server_1.httpServer.createNull();
            yield startAsync(server, onRequestAsync);
            const response = yield server.simulateRequest(expectedRequest);
            expect(response).toEqual(expectedResponse);
            expect(actualRequest).toEqual(expectedRequest);
        }));
        it("fails fast when we simulate the request before starting the null server", () => __awaiter(void 0, void 0, void 0, function* () {
            const server = http_server_1.httpServer.createNull();
            expect(() => server.simulateRequest()).rejects.toThrow("Could not simulate the request before starting the server");
        }));
        it("fails gracefully when request handler throw exception", () => __awaiter(void 0, void 0, void 0, function* () {
            const onRequestAsync = () => {
                throw new Error("onRequestAsync error");
            };
            const response = yield getAsync({ onRequestAsync });
            expect(response).toEqual({
                status: 500,
                headers: { "content-type": "text/plain; charset=utf-8" },
                body: "Internal Server Error: request handler threw exception",
            });
        }));
    });
    it("fails fast when server is stopped when it is not running", () => __awaiter(void 0, void 0, void 0, function* () {
        const server = http_server_1.httpServer.create();
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield stopAsync(server); })).rejects.toThrow("Can't stop server because it is not running");
    }));
});
describe("nullability", () => {
    it("does not actually start or stop the server", () => __awaiter(void 0, void 0, void 0, function* () {
        const server = http_server_1.httpServer.createNull();
        const server2 = http_server_1.httpServer.createNull();
        yield startAsync(server);
        expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield startAsync(server2); })).not.toThrow();
        yield stopAsync(server);
    }));
});
