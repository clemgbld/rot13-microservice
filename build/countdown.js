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
exports.countdownAsync = void 0;
const countdownAsync = (textArr, commandLine, clock) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < textArr.length; i++) {
        commandLine.writeOutpout(textArr[i]);
        if (i < textArr.length - 1)
            yield clock.waitAsync(1000);
    }
    commandLine.writeOutpout(clock.toFormattedString({
        dateStyle: "medium",
        timeStyle: "short",
    }));
});
exports.countdownAsync = countdownAsync;
