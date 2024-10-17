import { keccak_256 as keccak256 } from "@noble/hashes/sha3";
import { utf8ToBytes } from "@noble/hashes/utils";
import { sha512 } from "@noble/hashes/sha512";
import { sha256 } from "@noble/hashes/sha256";
import { SignatureConfig } from "../interfaces";
import { uint8ArrayToHex } from ".";
import { Curve, CurveName } from "../curves";
import { Point } from "../point";
import { hashToCurve } from "@noble/curves/secp256k1";

export enum HashFunction {
  KECCAK256 = "keccak256",
  SHA512 = "sha512",
  SHA256 = "sha256",
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
export function hash(
  data: (string | bigint)[],
  config?: SignatureConfig,
): string {
  let fct = config?.hash;
  if (!config) fct = HashFunction.KECCAK256;
  switch (fct) {
    case HashFunction.KECCAK256: {
      return keccak_256(data, config?.evmCompatibility);
    }
    case HashFunction.SHA512: {
      return sha_512(data);
    }
    case HashFunction.SHA256: {
      return sha_256(data);
    }
    default: {
      return keccak_256(data, config?.evmCompatibility);
    }
  }
}

/**
 * Hash data using keccak256
 *
 * @param input - The data to hash
 * @param evmCompatible - Whether to use EVM compatibility (pad inputs to 32 bytes)
 *
 * @returns - The hash of the data as a hex string
 */
export function keccak_256(
  input: (string | bigint)[],
  evmCompatible?: boolean,
): string {
  // If evmCompatibility is true, pad all elements to 32 bytes, concat them, and hash as the EVM verifier does
  if (evmCompatible) {
    try {
      const data = Buffer.concat(
        input.map((item) => {
          if (typeof item === "bigint") {
            // For bigints, convert to 32-byte buffers (uint256)
            return tobe256(item);
          } else if (typeof item === "string") {
            // For strings, convert to 32-byte padded buffers (bytes32)
            return Buffer.from(item, "utf-8");
          } else {
            throw new Error(
              "evm compatibility is true. All elements must be of type bigint or string.",
            );
          }
        }),
      );
      return uint8ArrayToHex(keccak256(data));
    } catch (error) {
      throw new Error(
        "evm compatibility is true. All elements must be of type bigint or string.",
      );
    }
  }

  // Non-evmCompatible case: serialize input as string and hash
  return Buffer.from(keccak256(serializeInput(input))).toString("hex");
}

/**
 * Hash data using sha512
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data  as an hex string
 */
export function sha_512(input: (string | bigint)[]): string {
  return Buffer.from(sha512(serializeInput(input))).toString("hex");
}

/**
 * Hash data using sha256
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data as an hex string
 */
export function sha_256(input: (string | bigint)[]): string {
  return Buffer.from(sha256(serializeInput(input))).toString("hex");
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

/* ------------------ Hash to curve functions ------------------ */

/**
 * Hash the data using sha256 and map the digest to a point on the specified curve
 *
 * @param data - The data to hash
 * @param curve - The curve to map the hash to
 *
 * @returns - The hash of the data as a point on the specified curve
 */
export function ecHash(input: (string | bigint)[], curve: Curve): Point {
  switch (curve.name) {
    case CurveName.SECP256K1: {
      const affinePoint = hashToCurve(utf8ToBytes(serializeInput(input)), {
        DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
      }).toAffine();
      return new Point(curve, [affinePoint.x, affinePoint.y]);
    }
    default:
      throw new Error(`Curve ${curve.name} not supported`);
  }
}

/**
 * serialized the input
 * @param input the input data
 **/

function serializeInput(input: (bigint | string)[]): string {
  return input.map((x) => (typeof x === "bigint" ? x.toString() : x)).join("");
}
