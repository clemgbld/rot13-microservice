"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rot13 = void 0;
const isNotALetter = (letter) => !/[a-z]|[A-Z]/.test(letter);
const rot13CodeCalc = (letter) => {
    const code = letter.charCodeAt(0);
    const codeRot13 = letter.toLowerCase() > "m" ? code - 13 : code + 13;
    return codeRot13;
};
const rot13Conversion = (letter) => isNotALetter(letter) ? letter : String.fromCharCode(rot13CodeCalc(letter));
const rot13 = (str) => str
    .split("")
    .map((l) => rot13Conversion(l))
    .join("");
exports.rot13 = rot13;
