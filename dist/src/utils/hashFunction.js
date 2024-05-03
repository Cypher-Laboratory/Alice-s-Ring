"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tobe256 = exports.sha_512 = exports.keccak_256 = exports.hash = exports.HashFunction = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const sha512_1 = require("@noble/hashes/sha512");
const _1 = require(".");
var HashFunction;
(function (HashFunction) {
    HashFunction["KECCAK256"] = "keccak256";
    HashFunction["SHA512"] = "sha512";
})(HashFunction || (exports.HashFunction = HashFunction = {}));
/* ------------------ Hash functions ------------------ */
/**
 * Hash data using the specified hash function (default: keccak256)
 *
 * @param data - The data to hash
 * @param fct - The hash function to use (optional)
 *
 * @returns - The hash of the data
 */
function hash(data, config) {
    let fct = config?.hash;
    if (!config)
        fct = HashFunction.KECCAK256;
    switch (fct) {
        case HashFunction.KECCAK256: {
            return keccak_256(data, config?.evmCompatibility);
        }
        case HashFunction.SHA512: {
            return sha_512(data);
        }
        default: {
            return keccak_256(data, config?.evmCompatibility);
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
function keccak_256(input, evmCompatible) {
    // if evmCompatibility is true, pad all elements to 32 bytes, concat them and hash as the evm verifier does
    if (evmCompatible) {
        try {
            const data = Buffer.concat(input.map(tobe256));
            return (0, _1.uint8ArrayToHex)((0, sha3_1.keccak_256)(data));
        }
        catch (error) {
            throw new Error("evm compatibility is true. All elements must be of type bigint.");
        }
    }
    const serialized = input
        .map((x) => (typeof x === "bigint" ? x.toString() : x))
        .join("");
    return Buffer.from((0, sha3_1.keccak_256)(serialized)).toString("hex");
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
    const serialized = input
        .map((x) => (typeof x === "bigint" ? x.toString() : x))
        .join("");
    return Buffer.from((0, sha512_1.sha512)(serialized)).toString("hex");
}
exports.sha_512 = sha_512;
/**
 * Zero-pad a buffer to the specified length
 *
 * @param x - The buffer to pad
 * @param l - The length to pad to
 * @returns - The padded buffer
 */
function zpad(x, l) {
    return Buffer.concat([Buffer.alloc(Math.max(0, l - x.length), 0), x]);
}
/**
 * Convert a bigint to a buffer of 32 bytes (256 bits)
 *
 * @param v - The bigint to convert
 * @returns - The buffer
 */
function tobe256(v) {
    let hexString = v.toString(16);
    if (hexString.length % 2 !== 0)
        hexString = "0" + hexString; // Ensure even length
    const numBytes = hexString.length / 2;
    const buffer = Buffer.alloc(numBytes);
    for (let i = 0; i < numBytes; i++) {
        const byteHex = hexString.substring(i * 2, i * 2 + 2);
        buffer.writeUInt8(parseInt(byteHex, 16), i);
    }
    return zpad(buffer, 32); // Zero-pad to 256 bits (32 bytes)
}
exports.tobe256 = tobe256;
