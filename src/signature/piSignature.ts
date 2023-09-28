/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
import { Curve, Point, modulo } from "../utils";
import { CurveName } from "../utils/curves";
import { ExtendedPoint } from "../utils/noble-libraries/noble-ED25519";

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
  nonce: bigint,
  message: bigint,
  signerPrivKey: bigint,
  curve: Curve,
): bigint {
  return modulo(nonce - message * signerPrivKey, curve.N);
}

/**
 * Verify a signature generated with the `piSignature` function
 *
 * @param signerPubKey - The signer public key
 * @param piSignature - The signature
 * @param nonce - The nonce used (= alpha in our ring signature scheme)
 * @param message - The message (as bigint) (= c[pi] in our ring signature scheme)
 * @param curve - The curve to use
 * @returns true if the signature is valid, false otherwise
 */
export function verifyPiSignature(
  signerPubKey: Point,
  piSignature: bigint,
  nonce: bigint,
  message: bigint,
  curve: Curve,
): boolean {
  const G: Point = curve.GtoPoint(); // curve generator
  // G * piSignature === (alpha * G) - c * (k * G)
  return G.mult(piSignature).equals(
    G.mult(nonce).add(signerPubKey.mult(message).negate()),
  );
}
// const G = new Point(new Curve(CurveName.SECP256K1), [ExtendedPoint.BASE.toAffine().x, ExtendedPoint.BASE.toAffine().y] as [
//   bigint,
//   bigint,
// ]);

// const privKey = 56465485646545848564865486545864546546545n;
// const pubKey = new Curve(CurveName.SECP256K1).GtoPoint().mult(privKey);

// const nonce = 648658648648654856354n;
// const msg = 1234456677788n;

// const sig = piSignature(
//   nonce,
//   msg,
//   privKey,
//   new Curve(CurveName.SECP256K1),
// )

// console.log(verifyPiSignature(pubKey, sig, nonce, msg, new Curve(CurveName.SECP256K1)))
