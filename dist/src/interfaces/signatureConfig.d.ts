import { hashFunction } from "../utils/hashFunction";
/**
 * Signature config interface
 *
 * @see hash - The hash function to use (input: string, output: Uint8Array)
 */
export interface SignatureConfig {
    hash?: hashFunction;
}
