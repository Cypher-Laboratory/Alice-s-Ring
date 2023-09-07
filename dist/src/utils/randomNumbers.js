"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomSecuredNumber = exports.randomBigint = void 0;
const node_crypto_1 = require("node:crypto");
function randomBigint(max) {
    const maxBytes = max.toString(16).length;
    const array = (0, node_crypto_1.randomBytes)(maxBytes);
    const randomHex = array.toString("hex");
    const randomBig = BigInt("0x" + randomHex);
    return randomBig % max;
}
exports.randomBigint = randomBigint;
function getRandomSecuredNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.getRandomSecuredNumber = getRandomSecuredNumber;
