"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomSecuredNumber = exports.randomBigint = void 0;
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
    //we use a while loop as a safeguard against the case where the random number is greater than the max value
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const array = (0, node_crypto_1.randomBytes)(byteSize);
        const randomHex = array.toString("hex");
        const randomBig = BigInt("0x" + randomHex);
        if (randomBig < max) {
            return randomBig;
        }
    }
}
exports.randomBigint = randomBigint;
/**
 * generate a random number in [min, max]
 *
 * @param min the min value of the random number
 * @param max the max value of the random number
 * @returns the random number
 */
function getRandomSecuredNumber(min, max) {
    if (min > max) {
        throw new Error("Min value should be less than or equal to max value.");
    }
    if (min < 0) {
        throw (0, errors_1.tooSmall)("min", min);
    }
    if (max < 0) {
        throw (0, errors_1.tooSmall)("Max", max);
    }
    if (min === max) {
        return min;
    }
    const range = max - min + 1;
    const byteSize = Math.ceil(Math.log2(range) / 8);
    //we use a while loop as a safeguard against the case where the random number is greater than the max value
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const array = (0, node_crypto_1.randomBytes)(byteSize);
        const value = array.readUIntBE(0, byteSize);
        if (value < range) {
            return value + min;
        }
    }
}
exports.getRandomSecuredNumber = getRandomSecuredNumber;
