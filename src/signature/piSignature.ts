/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
import { modulo, hash, formatPoint } from "../utils";
import { Point } from "../point";
import { Curve } from "../curves";
import { SignatureConfig } from "../interfaces";
/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 * It is really close to a schnorr signature.
 *
 * @param nonce - the nonce to use
 * @param message - the message to sign
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
export function piSignature(
  nonce: bigint, // = alpha in our ring signature scheme
  message: bigint, // = c in our ring signature scheme
  signerPrivKey: bigint,
  curve: Curve,
): bigint {
  return modulo(nonce + message * signerPrivKey, curve.N);
}

/**
 * Verify a signature generated with the `piSignature` function
 *
 * @param message - The message (as bigint) (= c[pi] in our ring signature scheme)
 * @param signerPubKey - The signer public key
 * @param c - The challenge (= c in our ring signature scheme)
 * @param piSignature - The signature
 * @param curve - The curve to use
 * @param config - The signature config
 *
 * @returns true if the signature is valid, false otherwise
 */
export function verifyPiSignature(
  message: string,
  signerPubKey: Point,
  c: bigint,
  piSignature: bigint,
  curve: Curve,
  config?: SignatureConfig,
): boolean {
  const G: Point = curve.GtoPoint(); // curve generator

  // compute H(m|[r*G - c*K])
  const cprime = hash(
    message +
      formatPoint(
        G.mult(piSignature).add(signerPubKey.mult(c).negate()),
        config,
      ),
    config?.hash,
  );
  return cprime === c.toString(16);
}
