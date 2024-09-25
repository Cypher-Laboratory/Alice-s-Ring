export { randomBigint } from "./randomNumbers";
export { modulo } from "./modulo";
export { keccak_256, hash, sha_512 } from "./hashFunction";
export { base64Regex } from "./base64";
export { modPow } from "./modPow";
export {
  u256ArrayToBytes,
  cairoHash,
  stringToBigInt,
  serializeRingCairo,
} from "./cairo_utils";
export { pointToWeirstrass, prepareGaragaHints } from "./garaga_bindings";
export { convertToUint384, uint384Serialize, Uint384 } from "./u384";
/**
 * Utils function to cast uint8 array to hex string
 * @param array - The array to cast
 * @returns The hex string
 */
export function uint8ArrayToHex(array: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < array.length; i++) {
    hex += ("00" + array[i].toString(16)).slice(-2);
  }
  return hex;
}
