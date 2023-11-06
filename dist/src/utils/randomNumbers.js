"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomSecuredNumber = exports.randomBigint = void 0;
const node_crypto_1 = require("node:crypto");
function randomBigint(max) {
    if (max <= 0n) {
        throw new Error("Max value should be greater than 0.");
    }
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
function getRandomSecuredNumber(min, max) {
    if (min > max) {
        throw new Error("Min value should be less than or equal to max value.");
    }
    if (min < 0) {
        throw new Error("Min value should be greater than or equal to 0.");
    }
    if (max < 0) {
        throw new Error("Max value should be greater than or equal to 0.");
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
