import { keccak_256 } from "@noble/hashes/sha3";
import { poseidonHashMany } from "@scure/starknet";
import { Point, uint384Serialize } from "@cypher-laboratory/ring-sig-utils";
/**
 * Serialize a ring, i.e., serialize each point in the ring
 *
 * @param ring - The ring to serialize
 *
 * @returns The serialized ring as a string array
 */
export function serializeRingCairo(ring: Point[]): bigint[] {
  let serializedPoints: bigint[] = [];
  for (const point of ring) {
    serializedPoints = serializedPoints.concat(
      uint384Serialize(point.toU384Coordinates()[1]),
    );
  }

  return serializedPoints;
}

/**
 * Computes a Keccak-256 hash of the given array of bigints, ensuring that the
 * resulting hash is compatible between Cairo (StarkNet) and TypeScript.
 * @param {bigint[]} data - An array of bigint numbers representing the input to be hashed.
 * @returns {bigint} - The resulting Keccak-256 hash represented as a bigint.
 * @example
 * const hash = cairoHash([123456789n, 987654321n]);
 * console.log(hash); // Outputs a bigint hash
 */
export function cairoHash(data: bigint[]): bigint {
  return BigInt("0x" + Buffer.from(poseidonHashMany(data).toString(16)));
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
export function stringToBigInt(str: string): bigint {
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

/**
 * Converts an array of 256-bit unsigned bigint values into a concatenated byte array (`Uint8Array`).
 * @param {bigint[]} u256Array - An array of 256-bit unsigned integers (bigint) to be converted into a byte array.
 * @returns {Uint8Array} - A byte array where each 256-bit bigint from the input array is represented by 32 bytes.
 * @example
 * const byteArray = u256ArrayToBytes([1234567890123456789012345678901234567890n, 9876543210987654321098765432109876543210n]);
 * console.log(byteArray); // Outputs a Uint8Array where each bigint is represented as 32 bytes
 */
export function u256ArrayToBytes(u256Array: bigint[]): Uint8Array {
  const result: number[] = [];
  for (const u256 of u256Array) {
    const bytes = u256ToBytes(u256);
    result.push(...bytes);
  }

  return new Uint8Array(result);
}

/**
 * Converts a 256-bit unsigned bigint (`u256`) into a 32-byte array (`Uint8Array`).
 * @param {bigint} u256 - The 256-bit unsigned integer (bigint) to be converted into a 32-byte array.
 * @returns {Uint8Array} - A 32-byte array representing the `u256` bigint.
 * @example
 * const bytes = u256ToBytes(1234567890123456789012345678901234567890n);
 * console.log(bytes); // Outputs a Uint8Array of length 32
 */
function u256ToBytes(u256: bigint): Uint8Array {
  const buffer = new ArrayBuffer(32);
  const view = new DataView(buffer);

  for (let i = 0; i < 32; i++) {
    view.setUint8(31 - i, Number(u256 & 255n));
    u256 >>= 8n;
  }

  return new Uint8Array(buffer);
}
