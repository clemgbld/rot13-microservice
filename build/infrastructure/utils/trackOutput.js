"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackOutput = void 0;
var trackOutput = function (emitter, event) {
    var outpouts = [];
    var trackerFn = function (output) {
        outpouts.push(output);
    };
    emitter.on(event, trackerFn);
    var consume = function () {
        var result = __spreadArray([], outpouts, true);
        outpouts.length = 0;
        return result;
    };
    var turnOffTracking = function () {
        consume();
        emitter.off(event, trackerFn);
    };
    return { outpouts: outpouts, turnOffTracking: turnOffTracking, consume: consume };
};
exports.trackOutput = trackOutput;
