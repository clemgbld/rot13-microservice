"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidContentType = exports.validResponse = exports.methodNotAllowed = exports.notFound = exports.errorResponse = void 0;
const response = ({ status, value }) => ({
    status: status,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(value),
});
const errorResponse = ({ status, error, }) => response({ status, value: { error } });
exports.errorResponse = errorResponse;
const notFound = () => (0, exports.errorResponse)({ status: 404, error: "Not found" });
exports.notFound = notFound;
const methodNotAllowed = () => (0, exports.errorResponse)({ status: 405, error: "Method not allowed" });
exports.methodNotAllowed = methodNotAllowed;
const validResponse = (outpout) => response({ status: 200, value: { transformed: outpout } });
exports.validResponse = validResponse;
const invalidContentType = () => (0, exports.errorResponse)({ status: 405, error: "Invalid content type" });
exports.invalidContentType = invalidContentType;
