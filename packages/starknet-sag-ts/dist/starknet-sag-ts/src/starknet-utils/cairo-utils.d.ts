import { Point } from "@cypher-laboratory/ring-sig-utils";
/**
 * Serialize a ring, i.e., serialize each point in the ring
 *
 * @param ring - The ring to serialize
 *
 * @returns The serialized ring as a bigint array
 */
export declare function serializeRingCairo(ring: Point[]): bigint[];
/**
 * Computes a Poseidon hash of the given array of bigints, ensuring that the
 * resulting hash is compatible between Cairo (StarkNet) and TypeScript.
 * @param {bigint[]} data - An array of bigint numbers representing the input to be hashed.
 * @returns {bigint} - The resulting Poseidon hash represented as a bigint.
 * @example
 * const hash = cairoHash([123456789n, 987654321n]);
 * console.log(hash); // Outputs a bigint hash
 */
export declare function cairoHash(data: bigint[]): bigint;
/**
 * Converts a string to its corresponding bigint representation by encoding the string
 * as a UTF-8 byte array and then converting it to a hexadecimal string.
 * @param {string} str - The input string to be converted to a bigint.
 * @returns {bigint} - The bigint representation of the input string.
 * @example
 * const bigIntValue = stringToBigInt("hello");
 * console.log(bigIntValue); // Outputs the bigint corresponding to the string "hello"
 */
export declare function stringToBigInt(str: string): bigint;
