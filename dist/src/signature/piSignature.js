"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piSignature = void 0;
const utils_1 = require("../utils");
/**
 * Compute the signature from the actual signer
 *
 * @param alpha - the alpha value (random number generated at the beginning of the signature)
 * @param c - the c[pi] value
 * @param signerPrivKey - the private key of the signer
 * @param p - the order of the curve
 *
 * @returns the signature
 */
function piSignature(alpha, c, signerPrivKey, p) {
    return (0, utils_1.modulo)(alpha - c * signerPrivKey, p);
}
exports.piSignature = piSignature;
