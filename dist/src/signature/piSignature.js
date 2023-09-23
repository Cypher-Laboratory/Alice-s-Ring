"use strict";
/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/)
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.piSignature = void 0;
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
    let P; // order of the curve
    let G; // generator point
    switch (curve) {
        case utils_1.Curve.SECP256K1:
            P = utils_1.SECP256K1.P;
            G = new utils_1.Point(curve, [utils_1.SECP256K1.G[0], utils_1.SECP256K1.G[1]]);
            break;
        case utils_1.Curve.ED25519:
            throw new Error("ED25519 not implemented yet");
        default:
            throw new Error("unknown curve");
    }
    // return = r * G = alpha * G - c * (k * G)  (mod P)
    return G.mult(alpha)
        .add(G.mult(signerPrivKey)
        .mult(c)
        .negate()
        .modulo(P));
}
exports.piSignature = piSignature;
