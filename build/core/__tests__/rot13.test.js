"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rot13_1 = require("../rot13");
describe("rot13", () => {
    it("should transform lowercase chars", () => {
        expect((0, rot13_1.rot13)("abcdefghijklmnopqrstuvwxyz")).toBe("nopqrstuvwxyzabcdefghijklm");
    });
    it("should transform for uppercase chars", () => {
        expect((0, rot13_1.rot13)("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe("NOPQRSTUVWXYZABCDEFGHIJKLM");
    });
    it("should be the same output for an empty string", () => {
        expect((0, rot13_1.rot13)("")).toBe("");
    });
    it("should be the same output for special caracters", () => {
        expect((0, rot13_1.rot13)("@[`{")).toBe("@[`{");
    });
    it("should be the same the same output for numbers", () => {
        expect((0, rot13_1.rot13)("1234567890")).toBe("1234567890");
    });
    it("should be the same outpout for non english letters", () => {
        expect((0, rot13_1.rot13)("éîôëôê")).toBe("éîôëôê");
    });
    it("should be the same outpout for emojis", () => {
        expect((0, rot13_1.rot13)("😀😄")).toBe("😀😄");
    });
});
