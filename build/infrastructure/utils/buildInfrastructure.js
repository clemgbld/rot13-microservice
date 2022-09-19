"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInfrastructure = void 0;
const ramda_1 = require("ramda");
const withConstructor_1 = require("../../utils/withConstructor");
const buildInfrastructure = ({ dependancy, infrastructureObj, withMixin, }) => (0, ramda_1.pipe)(withMixin(dependancy), (0, withConstructor_1.withConstructor)(infrastructureObj))({});
exports.buildInfrastructure = buildInfrastructure;
