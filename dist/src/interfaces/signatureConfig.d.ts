import { HashFunction } from "../utils/HashFunction";
/**
 * Signature config interface
 *
 * @see hash - The hash function to use (input: string, output: Uint8Array)
 */
export interface SignatureConfig {
    hash?: HashFunction;
}
