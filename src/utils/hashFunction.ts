import { uint8ArrayToHex } from "./convertTypes/uint8ArrayToHex";
import { keccak_256 } from "@noble/hashes/sha3";
import * as ed from "../utils/noble-libraries/noble-ED25519";
import { sha512 } from "@noble/hashes/sha512";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export enum hashFunction {
  KECCAK256 = "keccak256",
  SHA512 = "sha512",
}

/**
 * Hash data using the specified hash function (default: keccak256)
 *
 * @param data - The data to hash
 * @param fct - The hash function to use
 *
 * @returns - The hash of the data
 */
export function hash(data: string, fct?: hashFunction): string {
  if (!fct) fct = hashFunction.KECCAK256;
  switch (fct) {
    case hashFunction.KECCAK256: {
      return keccak256(data);
    }
    case hashFunction.SHA512: {
      return sha_512(data);
    }
    default: {
      throw new Error("Unknown hash function: " + fct);
    }
  }
}

/**
 * Hash data using keccak256
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data
 */
export function keccak256(input: string): string {
  return uint8ArrayToHex(keccak_256(input));
}

/**
 * Hash data using sha512
 *
 * @param input - The data to hash
 *
 * @returns - The hash of the data
 */
export function sha_512(input: string): string {
  return uint8ArrayToHex(sha512(input));
}
