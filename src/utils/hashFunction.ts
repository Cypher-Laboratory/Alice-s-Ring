import { uint8ArrayToHex } from "./convertTypes/uint8ArrayToHex";
import { keccak_256 } from "@noble/hashes/sha3";
import * as ed from "../utils/noble-libraries/noble-ED25519";
import { sha512 } from "@noble/hashes/sha512";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export function keccak256(input: string): string {
  return uint8ArrayToHex(keccak_256(input));
}

export function sha_512(input: string): string {
  return uint8ArrayToHex(sha512(input));
}
