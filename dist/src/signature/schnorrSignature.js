"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchnorrSignature = exports.schnorrSignature = void 0;
/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/)
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
const utils_1 = require("../utils");
const curves_1 = require("../curves");
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
 * @returns { messageDigest: bigint, c: bigint, r: bigint } - The signature { messageDigest, c, r }
 */
function schnorrSignature(message, signerPrivKey, curve, alpha, config, keyPrefixing = true) {
    if (!alpha)
        alpha = (0, utils_1.randomBigint)(curve.N);
    const c = (0, utils_1.modulo)(BigInt("0x" +
        (0, utils_1.hash)((keyPrefixing
            ? (0, utils_1.formatPoint)((0, curves_1.derivePubKey)(signerPrivKey, curve))
            : "") +
            message +
            (0, utils_1.formatPoint)(curve.GtoPoint().mult(alpha)), config?.hash)), curve.N);
    const r = (0, utils_1.modulo)(alpha - c * signerPrivKey, curve.N);
    return { messageDigest: message, c, r };
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
    // compute H(R|m|[r*G + c*K]) (R is empty or signerPubkey). Return true if the result is equal to c
    const point = G.mult(signature.r).add(signerPubKey.mult(signature.c));
    const h = (0, utils_1.modulo)(BigInt("0x" +
        (0, utils_1.hash)((keyPrefixing ? (0, utils_1.formatPoint)(signerPubKey) : "") +
            message +
            (0, utils_1.formatPoint)(point), config?.hash)), curve.N);
    return h === signature.c;
}
exports.verifySchnorrSignature = verifySchnorrSignature;
