import { hashFunction } from "../utils/hashFunction";

/**
 * Signature config interface
 *
 * @see derivationConfig - The config to use for the key derivation
 * @see evmCompatibility - If true, the signature will be compatible with our EVM verifier contract
 * @see safeMode - If true, check if all the points are on the same curve
 * @see hash - The hash function to use (input: string, output: Uint8Array)
 */
export interface SignatureConfig {
  evmCompatibility?: boolean;
  safeMode?: boolean;
  hash?: hashFunction;
}
