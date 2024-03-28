"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBigint = void 0;
const node_crypto_1 = require("node:crypto");
const errors_1 = require("../errors");
/**
 * generate a random bigint in [1,max]
 *
 * @param max the max value of the random number
 * @returns the random bigint
 */
function randomBigint(max) {
    if (max <= 0n) {
        throw (0, errors_1.tooSmall)("Max", max);
    }
    // +1 to ensure we can reach max value
    const byteSize = (max.toString(16).length + 1) >> 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const array = (0, node_crypto_1.randomBytes)(byteSize);
        const randomHex = array.toString("hex");
        const randomBig = BigInt("0x" + randomHex);
        if (randomBig < max) {
            return randomBig + 1n;
        }
    }
}
exports.randomBigint = randomBigint;
