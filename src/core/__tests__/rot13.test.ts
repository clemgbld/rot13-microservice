import { rot13 } from "../rot13";

describe("rot13", () => {
  it("should transform lowercase chars", () => {
    expect(rot13("abcdefghijklmnopqrstuvwxyz")).toBe(
      "nopqrstuvwxyzabcdefghijklm"
    );
  });

  it("should transform for uppercase chars", () => {
    expect(rot13("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe(
      "NOPQRSTUVWXYZABCDEFGHIJKLM"
    );
  });

  it("should be the same output for an empty string", () => {
    expect(rot13("")).toBe("");
  });

  it("should be the same output for special caracters", () => {
    expect(rot13("@[`{")).toBe("@[`{");
  });

  it("should be the same the same output for numbers", () => {
    expect(rot13("1234567890")).toBe("1234567890");
  });

  it("should be the same outpout for non english letters", () => {
    expect(rot13("éîôëôê")).toBe("éîôëôê");
  });

  it("should be the same outpout for emojis", () => {
    expect(rot13("😀😄")).toBe("😀😄");
  });
});
