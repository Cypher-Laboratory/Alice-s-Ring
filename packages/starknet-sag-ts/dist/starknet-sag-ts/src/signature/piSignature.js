"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piSignature = piSignature;
const ring_sig_utils_1 = require("@cypher-laboratory/ring-sig-utils");
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
        signerPrivKey === BigInt(0) ||
        c >= curve.N ||
        alpha >= curve.N ||
        signerPrivKey >= curve.N)
        throw ring_sig_utils_1.errors.invalidParams();
    return (0, ring_sig_utils_1.mod)(alpha - c * signerPrivKey, curve.N);
}
