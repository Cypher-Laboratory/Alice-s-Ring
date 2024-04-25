import { keccak_256 as keccak256 } from "@noble/hashes/sha3";
import { sha512 } from "@noble/hashes/sha512";
import { Curve } from "../curves";
import { Point } from "../point";
import { SignatureConfig } from "../interfaces";
import { uint8ArrayToHex } from ".";

export enum hashFunction {
  KECCAK256 = "keccak256",
  SHA512 = "sha512",
}

/* ------------------ Hash functions ------------------ */

/**
 * Hash data using the specified hash function (default: keccak256)
 *
 * @param data - The data to hash
 * @param fct - The hash function to use (optional)
 *
 * @returns - The hash of the data
 */
export function hash(data: (string | bigint)[], config?: SignatureConfig): string {
  let fct = config?.hash;
  if (!config) fct = hashFunction.KECCAK256;
  switch (fct) {
    case hashFunction.KECCAK256: {
      return keccak_256(data, config?.evmCompatibility);
    }
    case hashFunction.SHA512: {
      return sha_512(data);
    }
    default: {
      return keccak_256(data);
    }
  }
}

/**
 * Hash data using keccak256
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data as an hex string
 */
export function keccak_256(input: (string | bigint)[], evmCompatible?: boolean): string {
  // if evmCompatibility is true, pad all elements to 32 bytes, concat them and hash as the evm verifier does
  if (evmCompatible) {
    try {
      const data = Buffer.concat((input as bigint[]).map(tobe256));
      const hash = keccak256(data);
      return BigInt("0x" + uint8ArrayToHex(hash)).toString();
    } catch (error) {
      throw new Error("evm compatibility is true. All elements must be of type bigint.");
    }
  }
  const serialized = input.map((x) => (typeof x === "bigint" ? x.toString() : x)).join("");
  return Buffer.from(keccak256(serialized)).toString("hex");
}

/**
 * Hash data using sha512
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data  as an hex string
 */
export function sha_512(input: (string | bigint)[]): string {
  const serialized = input.map((x) => (typeof x === "bigint" ? x.toString() : x)).join("");
  return Buffer.from(sha512(serialized)).toString("hex");
}

/**
 * Zero-pad a buffer to the specified length
 *
 * @param x - The buffer to pad
 * @param l - The length to pad to
 * @returns - The padded buffer
 */
function zpad(x: Buffer, l: number): Buffer {
  return Buffer.concat([Buffer.alloc(Math.max(0, l - x.length), 0), x]);
}

/**
 * Convert a bigint to a buffer of 32 bytes (256 bits)
 *
 * @param v - The bigint to convert
 * @returns - The buffer
 */
export function tobe256(v: bigint): Buffer {
  let hexString = v.toString(16);
  if (hexString.length % 2 !== 0) hexString = "0" + hexString; // Ensure even length
  const numBytes = hexString.length / 2;
  const buffer = Buffer.alloc(numBytes);
  for (let i = 0; i < numBytes; i++) {
    const byteHex = hexString.substring(i * 2, i * 2 + 2);
    buffer.writeUInt8(parseInt(byteHex, 16), i);
  }
  return zpad(buffer, 32); // Zero-pad to 256 bits (32 bytes)
}