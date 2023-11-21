"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCPI1 = void 0;
const _1 = require(".");
/**
 * Compute the value of Cpi+1
 *
 * @param message the message to sign digested
 * @param curve the curve to use
 * @param alpha the nonce value
 * @param config the config to use
 * @param ring the ring involved in the ring signature
 *
 * @returns the value of c1
 */
function computeCPI1(message, // = c in our ring signature scheme
curve, alpha, config, ring) {
    if (!alpha)
        alpha = (0, _1.randomBigint)(curve.N);
    const c = (0, _1.modulo)(BigInt("0x" +
        (0, _1.hash)((ring ? (0, _1.formatRing)(ring) : "") +
            message +
            (0, _1.formatPoint)(curve.GtoPoint().mult(alpha)), config?.hash)), curve.N);
    return c;
}
exports.computeCPI1 = computeCPI1;
