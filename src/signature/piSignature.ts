import { modulo } from "../utils";

/**
 * Compute the signature from the actual signer
 *
 * @param alpha - the alpha value (random number generated at the beginning of the signature)
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
  return alpha - modulo(c * signerPrivKey, p);
}
