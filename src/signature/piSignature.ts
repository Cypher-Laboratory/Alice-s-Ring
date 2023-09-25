/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/

import { Curve, ED25519, Point, SECP256K1, modulo } from "../utils";

/**
 * Compute the signature from the actual signer
 *
 * @param alpha - the alpha value
 * @param c - the c[pi] value
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
  let N: bigint; // curve order

  switch (curve) {
    case Curve.SECP256K1:
      N = SECP256K1.N;
      break;
    case Curve.ED25519:
      N = ED25519.N;
      break;
    default:
      throw new Error("unknown curve");
  }

  return modulo(alpha - c * signerPrivKey, N);
}

export function verifyPiSignature(
  signerPubKey: Point,
  piSignature: bigint,
  alpha: bigint,
  c: bigint,
  curve: Curve,
): boolean {
  let G: Point; // curve generator

  switch (curve) {
    case Curve.SECP256K1:
      G = new Point(Curve.SECP256K1, SECP256K1.G);
      break;
    case Curve.ED25519:
      G = new Point(Curve.ED25519, ED25519.G);
      break;
    default:
      throw new Error("unknown curve");
  }
  // G * piSignature === (alpha * G) - c * (k * G) ?
  return G.mult(piSignature).equals(
    G.mult(alpha).add(signerPubKey.mult(c).negate()),
  );
}
