"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piSignature = void 0;
/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/)
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
const utils_1 = require("../utils");
const errors_1 = require("../errors");
/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 *
 * @param alpha - the alpha value
 * @param c - the seed
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
function piSignature(alpha, c, signerPrivKey, curve) {
    if (alpha === BigInt(0) ||
        c === BigInt(0) ||
        signerPrivKey === BigInt(0) ||
        curve.N === BigInt(0))
        throw (0, errors_1.invalidParams)();
    return (0, utils_1.modulo)(alpha - c * signerPrivKey, curve.N);
}
exports.piSignature = piSignature;
