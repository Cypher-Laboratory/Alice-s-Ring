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
function piSignature(alpha, c, signerPrivKey, Curve) {
    let P; // order of the curve
    let G; // generator point
    switch (Curve) {
        case "SECP256K1":
            P = 2n ** 256n - 2n ** 32n - 977n;
            G = [
                55066263022277343669578718895168534326250603453777594175500187360389116729240n,
                32670510020758816978083085130507043184471273380659243275938904335757337482424n,
            ];
            // return = r * G = alpha * G - c * (k * G)  (mod P)
            return (0, utils_1.modulo)((0, utils_1.add)((0, utils_1.mult)(alpha, G), (0, utils_1.negate)((0, utils_1.mult)(c, (0, utils_1.mult)(signerPrivKey, G)))), P);
        case "ED25519":
            throw new Error("ED25519 not implemented yet");
        default:
            throw new Error("unknown curve");
    }
}
exports.piSignature = piSignature;
