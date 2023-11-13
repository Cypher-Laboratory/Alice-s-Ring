"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPiSignature = exports.piSignature = void 0;
/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/)
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
const utils_1 = require("../utils");
/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 * It is really close to a schnorr signature.
 *
 * @param nonce - the nonce to use
 * @param message - the message to sign
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
function piSignature(nonce, // = alpha in our ring signature scheme
message, // = c in our ring signature scheme
signerPrivKey, curve) {
    return (0, utils_1.modulo)(nonce + message * signerPrivKey, curve.N);
}
exports.piSignature = piSignature;
/**
 * Verify a signature generated with the `piSignature` function
 *
 * @param message - The message (as bigint) (= c[pi] in our ring signature scheme)
 * @param signerPubKey - The signer public key
 * @param c - The challenge (= c in our ring signature scheme)
 * @param piSignature - The signature
 * @param curve - The curve to use
 * @param config - The signature config
 *
 * @returns true if the signature is valid, false otherwise
 */
function verifyPiSignature(message, signerPubKey, c, piSignature, curve, config) {
    const G = curve.GtoPoint(); // curve generator
    // compute H(m|[r*G - c*K])
    const cprime = (0, utils_1.hash)(message +
        (0, utils_1.formatPoint)(G.mult(piSignature).add(signerPubKey.mult(c).negate()), config), config?.hash);
    return cprime === c.toString(16);
}
exports.verifyPiSignature = verifyPiSignature;
