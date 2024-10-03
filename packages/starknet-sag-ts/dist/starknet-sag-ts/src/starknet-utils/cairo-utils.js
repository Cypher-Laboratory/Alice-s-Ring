"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeRingCairo = serializeRingCairo;
exports.cairoHash = cairoHash;
exports.stringToBigInt = stringToBigInt;
const starknet_1 = require("@scure/starknet");
const ring_sig_utils_1 = require("@cypher-laboratory/ring-sig-utils");
/**
 * Serialize a ring, i.e., serialize each point in the ring
 *
 * @param ring - The ring to serialize
 *
 * @returns The serialized ring as a bigint array
 */
function serializeRingCairo(ring) {
    let serializedPoints = [];
    for (const point of ring) {
        serializedPoints = serializedPoints.concat((0, ring_sig_utils_1.uint384Serialize)(point.toU384Coordinates()[1]));
    }
    return serializedPoints;
}
/**
 * Computes a Poseidon hash of the given array of bigints, ensuring that the
 * resulting hash is compatible between Cairo (StarkNet) and TypeScript.
 * @param {bigint[]} data - An array of bigint numbers representing the input to be hashed.
 * @returns {bigint} - The resulting Poseidon hash represented as a bigint.
 * @example
 * const hash = cairoHash([123456789n, 987654321n]);
 * console.log(hash); // Outputs a bigint hash
 */
function cairoHash(data) {
    return BigInt("0x" + Buffer.from((0, starknet_1.poseidonHashMany)(data).toString(16)));
}
/**
 * Converts a string to its corresponding bigint representation by encoding the string
 * as a UTF-8 byte array and then converting it to a hexadecimal string.
 * @param {string} str - The input string to be converted to a bigint.
 * @returns {bigint} - The bigint representation of the input string.
 * @example
 * const bigIntValue = stringToBigInt("hello");
 * console.log(bigIntValue); // Outputs the bigint corresponding to the string "hello"
 */
function stringToBigInt(str) {
    // Convert the string to a Uint8Array of UTF-8 encoded bytes
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    // Convert the bytes to a hexadecimal string
    const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    // Prepend '0x' to create a hexadecimal literal and convert to BigInt
    return BigInt("0x" + hex);
}
