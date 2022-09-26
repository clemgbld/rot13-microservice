"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rot13 = void 0;
var isNotALetter = function (letter) { return !/[a-z]|[A-Z]/.test(letter); };
var rot13CodeCalc = function (letter) {
    var code = letter.charCodeAt(0);
    var codeRot13 = letter.toLowerCase() > "m" ? code - 13 : code + 13;
    return codeRot13;
};
var rot13Conversion = function (letter) {
    return isNotALetter(letter) ? letter : String.fromCharCode(rot13CodeCalc(letter));
};
var rot13 = function (str) {
    return str
        .split("")
        .map(function (l) { return rot13Conversion(l); })
        .join("");
};
exports.rot13 = rot13;
