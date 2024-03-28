"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ED25519 = exports.SECP256K1 = void 0;
const src_1 = require("../../src");
exports.SECP256K1 = new src_1.Curve(src_1.CurveName.SECP256K1);
exports.ED25519 = new src_1.Curve(src_1.CurveName.ED25519);
