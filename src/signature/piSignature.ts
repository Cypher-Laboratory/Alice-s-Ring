/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/

import { modulo } from "../utils";

/**
 * Compute the signature from the actual signer
 *
 * @param alpha - the alpha value
 * @param c - the c[pi] value
 * @param signerPrivKey - the private key of the signer
 * @param p - the order of the curve
 *
 * @returns the signature
 */
export function piSignature(
  alpha: bigint,
  c: bigint,
  signerPrivKey: bigint,
  p: bigint,
): bigint {
  return alpha - c * signerPrivKey;
}
