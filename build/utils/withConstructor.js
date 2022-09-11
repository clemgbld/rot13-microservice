"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withConstructor = void 0;
const withConstructor = (constuctor) => (o) => (Object.assign({ __proto__: {
        constuctor,
    } }, o));
exports.withConstructor = withConstructor;
