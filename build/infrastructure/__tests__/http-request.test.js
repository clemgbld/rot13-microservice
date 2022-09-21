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
const helper_1 = require("../../test-helper/helper");
const http_request_1 = require("../http-request");
const PORT = 3549;
const createRequestAsync = (options, expectFnAsync) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const onRequestAsync = (request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            expectFnAsync(request);
            return { status: 200, headers: {}, body: "" };
        }
        catch (err) {
            reject(err);
        }
    });
    const server = http_server_1.httpServer.create();
    yield server.startAsync({
        port: PORT,
        onRequestAsync,
    });
    yield (0, helper_1.requestAsync)(Object.assign({ port: PORT }, options));
    yield server.stopAsync();
    resolve("resolve");
}));
describe("HTTP Request", () => {
    describe("Raw data", () => {
        it("provides the url", () => __awaiter(void 0, void 0, void 0, function* () {
            yield createRequestAsync({
                url: "/my-url",
            }, (request) => expect(request.url).toBe("/my-url"));
        }));
        it("provides the method (and normalized case)", () => __awaiter(void 0, void 0, void 0, function* () {
            yield createRequestAsync({
                method: "pOst",
            }, (request) => expect(request.method).toBe("POST"));
        }));
        it("provides the headers (and normalized case)", () => __awaiter(void 0, void 0, void 0, function* () {
            const headers = {
                myHeaDer1: "myHeader1",
                myHEader2: "myHeader2",
            };
            yield createRequestAsync({ headers }, (request) => {
                expect(request.headers).toEqual({
                    myheader1: "myHeader1",
                    myheader2: "myHeader2",
                    connection: "close",
                    "content-length": "0",
                    host: `localhost:${PORT}`,
                });
            });
        }));
        it("should throw an error when trying to mutate the headers", () => __awaiter(void 0, void 0, void 0, function* () {
            const headers = {
                header: "value",
            };
            yield createRequestAsync({ headers }, (request) => {
                try {
                    delete request.headers.header;
                }
                catch (err) {
                    expect(err.message).toBe("Cannot delete property 'header' of [object Object]");
                }
            });
        }));
        it("provides body", () => __awaiter(void 0, void 0, void 0, function* () {
            const body = ["chunk1", "chunk2"];
            yield createRequestAsync({
                body,
            }, (request) => __awaiter(void 0, void 0, void 0, function* () { return expect(yield request.readBodyAsync()).toBe("chunk1chunk2"); }));
        }));
        it("fails fast when the body is read twice", () => __awaiter(void 0, void 0, void 0, function* () {
            const body = ["chunk1", "chunk2"];
            yield createRequestAsync({
                body,
            }, (request) => __awaiter(void 0, void 0, void 0, function* () {
                yield request.readBodyAsync();
                yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield request.readBodyAsync(); })).rejects.toThrowError("Cannot read the body twice");
            }));
        }));
    });
    describe("cooked content type header", () => {
        const check = ({ contentType = "application/json", mediaType = "application/json", expectedResult = true, contentTypeKey = "content-type", }) => {
            const headers = { [contentTypeKey]: contentType };
            const request = http_request_1.httpRequest.createNull({ headers });
            expect(request.hasContentType(mediaType)).toBe(expectedResult);
        };
        it("checks if expected mediaty matchs contentype headers", () => {
            check({
                contentType: "application/json",
                mediaType: "application/json",
                expectedResult: true,
            });
        });
        it("checks that media type does not match ", () => {
            check({
                contentType: "text/plain",
                mediaType: "application/json",
                expectedResult: false,
            });
        });
        it("should be case insensitive when contentype is upperCase", () => {
            check({
                contentType: "APPLICATION/JSON",
                mediaType: "application/json",
                expectedResult: true,
            });
        });
        it("should be case insensitive when mediaType is upperCase", () => {
            check({
                contentType: "application/json",
                mediaType: "APPLICATION/JSON",
                expectedResult: true,
            });
        });
        it("should be false when there is no conetnt type", () => {
            check({
                contentType: "APPLICATION/JSON",
                mediaType: "application/json",
                expectedResult: false,
                contentTypeKey: "no",
            });
        });
        it("should ignores white spaces", () => {
            check({
                contentType: "  application/json  ",
                mediaType: "\tapplication/json\t",
                expectedResult: true,
            });
        });
        it("should ignore parameters", () => {
            check({
                contentType: "application/json;charset=utf-8;foo=bar",
                mediaType: "application/json",
                expectedResult: true,
            });
        });
    });
});
describe("nullability", () => {
    it("provides default values", () => __awaiter(void 0, void 0, void 0, function* () {
        const request = http_request_1.httpRequest.createNull();
        expect(request.url).toBe("/my-null-url");
        expect(request.method).toBe("GET");
        expect(request.headers).toEqual({});
        expect(yield request.readBodyAsync()).toEqual("");
    }));
    it("can configure the url", () => {
        const request = http_request_1.httpRequest.createNull({ url: "/my-url" });
        expect(request.url).toBe("/my-url");
    });
    it("can configure method (and normalize case)", () => {
        const request = http_request_1.httpRequest.createNull({ method: "pOst" });
        expect(request.method).toBe("POST");
    });
    it("can configure headers (and normalize case)", () => {
        const request = http_request_1.httpRequest.createNull({
            headers: {
                mYHeader1: "myvalue1",
                MYheader2: "myvalue2",
            },
        });
        expect(request.headers).toEqual({
            myheader1: "myvalue1",
            myheader2: "myvalue2",
        });
    });
    it("can configure the body", () => __awaiter(void 0, void 0, void 0, function* () {
        const request = http_request_1.httpRequest.createNull({ body: "my body" });
        expect(yield request.readBodyAsync()).toBe("my body");
    }));
    it("fails fast when body is read twice", () => __awaiter(void 0, void 0, void 0, function* () {
        const request = http_request_1.httpRequest.createNull();
        yield request.readBodyAsync();
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield request.readBodyAsync(); })).rejects.toThrowError("Cannot read the body twice");
    }));
});
