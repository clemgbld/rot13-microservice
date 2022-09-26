"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInfrastructure = void 0;
var ramda_1 = require("ramda");
var withConstructor_1 = require("../../utils/withConstructor");
var buildInfrastructure = function (_a) {
    var dependancy = _a.dependancy, infrastructureObj = _a.infrastructureObj, withMixin = _a.withMixin;
    return (0, ramda_1.pipe)(withMixin(dependancy), (0, withConstructor_1.withConstructor)(infrastructureObj))({});
};
exports.buildInfrastructure = buildInfrastructure;
