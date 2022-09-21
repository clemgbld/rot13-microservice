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
exports.app = void 0;
const rot13_router_1 = require("../routing/rot13-router");
const app = (commandLine, httpServer) => {
    const runServerAsync = (server, port) => __awaiter(void 0, void 0, void 0, function* () {
        const onRequestAsync = (request) => __awaiter(void 0, void 0, void 0, function* () {
            commandLine.writeOutpout("Recevied request");
            return yield (0, rot13_router_1.routeAsync)(request);
        });
        yield server.startAsync({ port, onRequestAsync });
        commandLine.writeOutpout(`Server started on port ${port}`);
    });
    return {
        startAsync: () => __awaiter(void 0, void 0, void 0, function* () {
            const input = commandLine.args();
            if (input.length === 0)
                return commandLine.writeOutpout("please provide an argument");
            if (input.length > 1)
                return commandLine.writeOutpout("please provide at most one argument");
            const port = +input[0];
            yield runServerAsync(httpServer, port);
        }),
    };
};
exports.app = app;
