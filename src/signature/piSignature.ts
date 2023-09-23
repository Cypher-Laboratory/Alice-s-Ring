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
  // r
  c: bigint,
  signerPrivKey: bigint,
  curve: Curve,
): Point {
  let N: bigint; // order of the curve
  let G: Point; // generator point

  switch (curve) {
    case Curve.SECP256K1:
      N = SECP256K1.N;
      G = new Point(curve, SECP256K1.G);
      break;
    case Curve.ED25519:
      N = ED25519.N;
      G = new Point(curve, ED25519.G);
      break;
    default:
      throw new Error("unknown curve");
  }
  // return: r * G = alpha * G - c * (k * G)  (mod N)
  return G.mult(alpha).add(G.mult(signerPrivKey).mult(c).negate().modulo(N)); // NON:  G.mult(signerPrivKey) = K => preuve forgeable
// rpi = addmodn(rpi, mulmodn(k, submodn(alpha, c[pi-1])));
// return modulo(r + modulo((signerPrivKey * modulo(alpha - c, N)), N), N);

}
