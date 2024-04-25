"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha_512 = exports.keccak_256 = exports.hash = exports.HashFunction = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const sha512_1 = require("@noble/hashes/sha512");
var HashFunction;
(function (HashFunction) {
    HashFunction["KECCAK256"] = "keccak256";
    HashFunction["SHA512"] = "sha512";
})(HashFunction || (exports.HashFunction = HashFunction = {}));
/**
 * Hash data using the specified hash function (default: keccak256)
 *
 * @param data - The data to hash
 * @param fct - The hash function to use (optional)
 *
 * @returns - The hash of the data
 */
function hash(data, fct) {
    if (!fct)
        fct = HashFunction.KECCAK256;
    switch (fct) {
        case HashFunction.KECCAK256: {
            return keccak_256(data);
        }
        case HashFunction.SHA512: {
            return sha_512(data);
        }
        default: {
            throw new Error("Unknown hash function: " + fct);
        }
    }
}
exports.hash = hash;
/**
 * Hash data using keccak256
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data as an hex string
 */
function keccak_256(input) {
    return Buffer.from((0, sha3_1.keccak_256)(input)).toString("hex");
}
exports.keccak_256 = keccak_256;
/**
 * Hash data using sha512
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data  as an hex string
 */
function sha_512(input) {
    return Buffer.from((0, sha512_1.sha512)(input)).toString("hex");
}
exports.sha_512 = sha_512;
