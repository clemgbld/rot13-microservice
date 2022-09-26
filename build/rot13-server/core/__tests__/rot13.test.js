"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rot13_1 = require("../rot13");
describe("rot13", function () {
    it("should transform lowercase chars", function () {
        expect((0, rot13_1.rot13)("abcdefghijklmnopqrstuvwxyz")).toBe("nopqrstuvwxyzabcdefghijklm");
    });
    it("should transform for uppercase chars", function () {
        expect((0, rot13_1.rot13)("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe("NOPQRSTUVWXYZABCDEFGHIJKLM");
    });
    it("should be the same output for an empty string", function () {
        expect((0, rot13_1.rot13)("")).toBe("");
    });
    it("should be the same output for special caracters", function () {
        expect((0, rot13_1.rot13)("@[`{")).toBe("@[`{");
    });
    it("should be the same the same output for numbers", function () {
        expect((0, rot13_1.rot13)("1234567890")).toBe("1234567890");
    });
    it("should be the same outpout for non english letters", function () {
        expect((0, rot13_1.rot13)("éîôëôê")).toBe("éîôëôê");
    });
    it("should be the same outpout for emojis", function () {
        expect((0, rot13_1.rot13)("😀😄")).toBe("😀😄");
    });
});
