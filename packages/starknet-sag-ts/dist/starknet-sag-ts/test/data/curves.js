"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ED25519 = exports.SECP256K1 = void 0;
const ring_sig_utils_1 = require("@cypher-laboratory/ring-sig-utils");
exports.SECP256K1 = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.SECP256K1);
exports.ED25519 = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.ED25519);
