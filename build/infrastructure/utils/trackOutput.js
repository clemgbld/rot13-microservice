"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackOutput = void 0;
const trackOutput = (emitter, event) => {
    let outpouts = [];
    const trackerFn = (output) => {
        outpouts.push(output);
    };
    emitter.on(event, trackerFn);
    const consume = () => {
        let result = [...outpouts];
        outpouts.length = 0;
        return result;
    };
    const turnOffTracking = () => {
        consume();
        emitter.off(event, trackerFn);
    };
    return { outpouts, turnOffTracking, consume };
};
exports.trackOutput = trackOutput;
