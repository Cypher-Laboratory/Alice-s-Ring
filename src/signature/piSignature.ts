/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/

import { modulo, Curve, mult, add, negate } from "../utils";

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
  Curve: Curve,
): [bigint, bigint] {
  let P: bigint; // order of the curve
  let G: [bigint, bigint]; // generator point

  switch (Curve) {
    case "SECP256K1":
      P = 2n ** 256n - 2n ** 32n - 977n;
      G = [
        55066263022277343669578718895168534326250603453777594175500187360389116729240n,
        32670510020758816978083085130507043184471273380659243275938904335757337482424n,
      ];
      // return = r * G = alpha * G - c * (k * G)  (mod P)
      return modulo(
        add(mult(alpha, G), negate(mult(c, mult(signerPrivKey, G)))),
        P,
      ) as [bigint, bigint];
    case "ED25519":
      throw new Error("ED25519 not implemented yet");
    default:
      throw new Error("unknown curve");
  }
}
