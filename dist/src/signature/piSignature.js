"use strict";
/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/)
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPiSignature = exports.piSignature = void 0;
const utils_1 = require("../utils");
/**
 * Compute the signature from the actual signer
 *
 * @param alpha - the alpha value
 * @param c - the c[pi] value
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
function piSignature(alpha, c, signerPrivKey, curve) {
    let N; // curve order
    switch (curve) {
        case utils_1.Curve.SECP256K1:
            N = utils_1.SECP256K1.N;
            break;
        case utils_1.Curve.ED25519:
            N = utils_1.ED25519.N;
            break;
        default:
            throw new Error("unknown curve");
    }
    return (0, utils_1.modulo)(alpha - c * signerPrivKey, N);
}
exports.piSignature = piSignature;
function verifyPiSignature(signerPubKey, piSignature, alpha, c, curve) {
    let G; // curve generator
    switch (curve) {
        case utils_1.Curve.SECP256K1:
            G = new utils_1.Point(utils_1.Curve.SECP256K1, utils_1.SECP256K1.G);
            break;
        case utils_1.Curve.ED25519:
            G = new utils_1.Point(utils_1.Curve.ED25519, utils_1.ED25519.G);
            break;
        default:
            throw new Error("unknown curve");
    }
    // G * piSignature === (alpha * G) - c * (k * G) ?
    return G.mult(piSignature).equals(G.mult(alpha).add(signerPubKey.mult(c).negate()));
}
exports.verifyPiSignature = verifyPiSignature;
