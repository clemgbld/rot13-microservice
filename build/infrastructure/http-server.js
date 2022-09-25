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
const events_1 = __importDefault(require("events"));
const http_1 = __importDefault(require("http"));
const http_request_1 = require("./http-request");
const buildInfrastructure_1 = require("./utils/buildInfrastructure");
class NullNodeServer extends events_1.default {
    constructor() {
        super();
    }
    listen() {
        setImmediate(() => this.emit("listening"));
    }
    close() {
        setImmediate(() => this.emit("close"));
    }
}
const nullHttp = {
    createServer: () => new NullNodeServer(),
};
const handleRequestAsync = (request, onRequestAsync, log) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield onRequestAsync(request);
        return response;
    }
    catch (error) {
        log.emergency({
            message: "request handler threw exception",
            error,
        });
        return {
            status: 500,
            headers: { "content-type": "text/plain; charset=utf-8" },
            body: "Internal Server Error: request handler threw exception",
        };
    }
});
const withHttpServer = ({ http, log }) => (o) => {
    let fakeOnRequestAsync;
    let server;
    return Object.assign(Object.assign({}, o), { isStarted: () => server !== undefined, startAsync: ({ port, onRequestAsync }) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (server !== undefined) {
                    throw new Error("Server must be closed before being restared");
                }
                fakeOnRequestAsync = onRequestAsync;
                server = http.createServer();
                server.on("error", (err) => {
                    reject(new Error(`Couldn't start server due to error: ${err.message}`));
                });
                server.on("request", (nodeRequest, nodeResponse) => __awaiter(void 0, void 0, void 0, function* () {
                    const { status = 501, body = "", headers = {}, } = yield handleRequestAsync(http_request_1.httpRequest.create(nodeRequest), onRequestAsync, log);
                    nodeResponse.statusCode = status;
                    Object.entries(headers).forEach(([name, value = ""]) => nodeResponse.setHeader(name, value));
                    nodeResponse.end(body);
                }));
                server.on("listening", resolve);
                server.listen(port);
            });
        }), stopAsync: () => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (!server) {
                    throw new Error("Can't stop server because it is not running");
                }
                server.on("close", resolve);
                server.close();
                server = undefined;
            });
        }), simulateRequest: (request = http_request_1.httpRequest.createNull()) => __awaiter(void 0, void 0, void 0, function* () {
            if (!fakeOnRequestAsync) {
                throw new Error("Could not simulate the request before starting the server");
            }
            return handleRequestAsync(request, fakeOnRequestAsync, log);
        }) });
};
exports.httpServer = {
    create: (log) => (0, buildInfrastructure_1.buildInfrastructure)({
        dependancy: { http: http_1.default, log },
        infrastructureObj: exports.httpServer,
        withMixin: withHttpServer,
    }),
    createNull: (log) => (0, buildInfrastructure_1.buildInfrastructure)({
        dependancy: { http: nullHttp, log },
        infrastructureObj: exports.httpServer,
        withMixin: withHttpServer,
    }),
};
