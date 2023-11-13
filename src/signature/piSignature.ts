/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
import { modulo } from "../utils";
import { Point } from "../point";
import { Curve } from "../curves";

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
  return modulo(nonce + message * signerPrivKey, curve.N); // P??
}

/**
 * Verify a signature generated with the `piSignature` function
 *
 * @param signerPubKey - The signer public key
 * @param piSignature - The signature
 * @param nonce - The nonce used (= alpha in our ring signature scheme)
 * @param message - The message (as bigint) (= c[pi] in our ring signature scheme)
 * @param curve - The curve to use
 *
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
  // G * piSignature === (alpha * G) + c * (k * G)
  return G.mult(piSignature).equals(
    G.mult(nonce).add(signerPubKey.mult(message)),
  );
}
