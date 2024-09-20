import { HashFunction } from "../utils/hashFunction";

/**
 * Signature config interface
 *
 * @remarks
 * Evm compatibility will only apply if the hash function is keccak256
 * if evmCompatibility is true:
 * - the signature will be compatible with our SAG EVM verifier contract
 * - the signature will be computed without key prefixing
 *
 * @see evmCompatibility - If true, the signature will be compatible with our EVM verifier contract
 * @see hash - The hash function to use (input: string, output: Uint8Array)
 */
export interface SignatureConfig {
  evmCompatibility?: boolean;
  hash?: HashFunction;
}
