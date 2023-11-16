"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchnorrSignature = exports.schnorrSignature = void 0;
/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/)
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
const utils_1 = require("../utils");
/**
 * Compute a Schnorr signature
 *
 * @param message - The message digest (as bigint)
 * @param signerPrivKey - The signer private key
 * @param curve - The curve to use
 * @param alpha - The alpha value (optional)
 * @param config - The signature config (optional)
 * @param keyPrefixing - Whether to prefix the hashed data with the public key (default: true)
 *
 * @returns { c: bigint, r: bigint } - The signature { c, r }
 */
function schnorrSignature(message, // = c in our ring signature scheme
signerPrivKey, curve, alpha, config, keyPrefixing = true) {
    if (!alpha)
        alpha = (0, utils_1.randomBigint)(curve.N);
    const c = BigInt("0x" +
        (0, utils_1.hash)((keyPrefixing
            ? (0, utils_1.formatPoint)(curve.GtoPoint().mult(alpha), config)
            : "") +
            message +
            (0, utils_1.formatPoint)(curve.GtoPoint().mult(alpha), config), config?.hash));
    const r = (0, utils_1.modulo)(alpha + c * signerPrivKey, curve.N);
    return { c, r };
}
exports.schnorrSignature = schnorrSignature;
/**
 * Verify a signature generated with the `schnorrSignature` function
 *
 * @param message - The message (as bigint) (= c[pi] in our ring signature scheme)
 * @param signerPubKey - The signer public key
 * @param signature - The signature { c, r }
 * @param curve - The curve to use
 * @param config - The signature config
 * @param keyPrefixing - Whether to prefix the hashed data with the public key (default: true)
 *
 * @returns true if the signature is valid, false otherwise
 */
function verifySchnorrSignature(message, signerPubKey, signature, curve, config, keyPrefixing = true) {
    const G = curve.GtoPoint(); // curve generator
    // compute H(m|[r*G - c*K]). Return true if the result is equal to c
    return ((0, utils_1.hash)((keyPrefixing ? (0, utils_1.formatPoint)(signerPubKey, config) : "") +
        message +
        (0, utils_1.formatPoint)(G.mult(signature.r).add(signerPubKey.mult(signature.c).negate()), config), config?.hash) === signature.c.toString(16));
}
exports.verifySchnorrSignature = verifySchnorrSignature;
