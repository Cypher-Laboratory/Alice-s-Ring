export { randomBigint } from "./randomNumbers";
export { modulo } from "./modulo";
export { keccak_256, hash, sha_512 } from "./hashFunction";
export { base64Regex } from "./base64";
export { modPow } from "./modPow";
/**
 * Utils function to cast uint8 array to hex string
 * @param array - The array to cast
 * @returns The hex string
 */
export declare function uint8ArrayToHex(array: Uint8Array): string;
