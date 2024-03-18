/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
import { modulo } from "../utils";
import { Curve } from "../curves";
import { invalidParams } from "../errors";
/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 *
 * @param alpha - the alpha value
 * @param c - the seed
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
export function piSignature(
  alpha: bigint,
  c: bigint,
  signerPrivKey: bigint,
  curve: Curve,
): bigint {
  if (
    alpha === BigInt(0) ||
    signerPrivKey === BigInt(0) ||
    c >= curve.N ||
    alpha >= curve.N ||
    signerPrivKey >= curve.N
  )
    throw invalidParams();

  return modulo(alpha - c * signerPrivKey, curve.N);
}
