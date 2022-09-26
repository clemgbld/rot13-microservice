"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = exports.invalidContentType = exports.validResponse = exports.methodNotAllowed = exports.notFound = exports.errorResponse = void 0;
var response = function (_a) {
    var status = _a.status, value = _a.value;
    return ({
        status: status,
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(value),
    });
};
var errorResponse = function (_a) {
    var status = _a.status, error = _a.error;
    return response({ status: status, value: { error: error } });
};
exports.errorResponse = errorResponse;
var notFound = function () {
    return (0, exports.errorResponse)({ status: 404, error: "Not found" });
};
exports.notFound = notFound;
var methodNotAllowed = function () {
    return (0, exports.errorResponse)({ status: 405, error: "Method not allowed" });
};
exports.methodNotAllowed = methodNotAllowed;
var validResponse = function (outpout) {
    return response({ status: 200, value: { transformed: outpout } });
};
exports.validResponse = validResponse;
var invalidContentType = function () {
    return (0, exports.errorResponse)({ status: 405, error: "Invalid content type" });
};
exports.invalidContentType = invalidContentType;
var badRequest = function (error) {
    return (0, exports.errorResponse)({ status: 400, error: error });
};
exports.badRequest = badRequest;
