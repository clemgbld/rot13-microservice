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
exports.routeAsync = void 0;
const ramda_1 = require("ramda");
const rot13_response_1 = require("./rot13-response");
const rot13_1 = require("../core/rot13");
const postValidTransformedRes = (0, ramda_1.pipe)(rot13_1.rot13, rot13_response_1.validResponse);
const routeAsync = (request) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.pathName !== "/rot-13/transform")
        return (0, rot13_response_1.notFound)();
    if (request.method !== "POST")
        return (0, rot13_response_1.methodNotAllowed)();
    if (!request.hasContentType("application/json"))
        return (0, rot13_response_1.invalidContentType)();
    const input = yield request.readBodyAsync();
    const jsonString = input;
    throw new Error("hi");
    try {
        const json = JSON.parse(jsonString);
        if (!json.text) {
            throw new Error("Json must have text field");
        }
        return postValidTransformedRes(json.text);
    }
    catch (err) {
        return (0, rot13_response_1.badRequest)(err.message);
    }
});
exports.routeAsync = routeAsync;
