/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
import { modulo } from "../utils";
import { Point } from "../point";
import { Curve } from "../curves";
import { invalidParams } from "../errors";
/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 * It is really close to a schnorr signature.
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
    c === BigInt(0) ||
    signerPrivKey === BigInt(0) ||
    curve.N === BigInt(0)
  )
    throw invalidParams();

  return modulo(alpha + c * signerPrivKey, curve.N);
}

/**
 * Verify a signature generated with the `piSignature` function
 *
 * @param alpha - The alpha value
 * @param signerPubKey - The signer public key
 * @param c - The challenge (= c in our ring signature scheme)
 * @param piSignature - The signature
 * @param curve - The curve to use
 * @param config - The signature config
 *
 * @returns true if the signature is valid, false otherwise
 */
export function verifyPiSignature(
  alpha: bigint,
  signerPubKey: Point,
  c: bigint,
  piSignature: bigint,
  curve: Curve,
): boolean {
  // checks
  if (
    !curve.isOnCurve(signerPubKey) ||
    alpha === BigInt(0) ||
    c === BigInt(0) ||
    piSignature === BigInt(0) ||
    piSignature >= curve.N ||
    piSignature === BigInt(0)
  ) {
    throw invalidParams();
  }

  const G: Point = curve.GtoPoint(); // curve generator

  return (
    G.mult(piSignature).x === G.mult(c).add(signerPubKey.mult(alpha)).x &&
    G.mult(piSignature).y === G.mult(c).add(signerPubKey.mult(alpha)).y
  );
}
