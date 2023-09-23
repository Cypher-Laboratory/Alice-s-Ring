/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/

import { modulo, Curve, Point, SECP256K1 } from "../utils";

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
): Point {
  let P: bigint; // order of the curve
  let G: Point; // generator point

  switch (curve) {
    case Curve.SECP256K1:
      P = SECP256K1.P;
      G = new Point(curve, [SECP256K1.G[0], SECP256K1.G[1]]);
      break;
    case Curve.ED25519:
      throw new Error("ED25519 not implemented yet");
    default:
      throw new Error("unknown curve");
  }

  // return = r * G = alpha * G - c * (k * G)  (mod P)
  return G.mult(alpha).add(G.mult(signerPrivKey).mult(c).negate().modulo(P));
}
