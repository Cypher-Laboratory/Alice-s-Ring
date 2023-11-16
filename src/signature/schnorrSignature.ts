/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
import { modulo, hash, formatPoint, randomBigint } from "../utils";
import { Point } from "../point";
import { Curve } from "../curves";
import { SignatureConfig } from "../interfaces";

/**
 * Compute a Schnorr signature
 *
 * @param message - The message digest (as bigint)
 * @param signerPrivKey - The signer private key
 * @param curve - The curve to use
 * @param alpha - The alpha value (optional)
 * @param config - The signature config (optional)
 * @param keyPrefixing - Whether to prefix the hashed data with the public key (default: true)
 *
 * @returns { c: bigint, r: bigint } - The signature { c, r }
 */
export function schnorrSignature(
  message: bigint, // = c in our ring signature scheme
  signerPrivKey: bigint,
  curve: Curve,
  alpha?: bigint,
  config?: SignatureConfig,
  keyPrefixing = true,
): { c: bigint; r: bigint } {
  if (!alpha) alpha = randomBigint(curve.N);

  const c = BigInt(
    "0x" +
      hash(
        (keyPrefixing
          ? formatPoint(curve.GtoPoint().mult(alpha), config)
          : "") +
          message +
          formatPoint(curve.GtoPoint().mult(alpha), config),
        config?.hash,
      ),
  );

  const r = modulo(alpha + c * signerPrivKey, curve.N);

  return { c, r };
}

/**
 * Verify a signature generated with the `schnorrSignature` function
 *
 * @param message - The message (as bigint) (= c[pi] in our ring signature scheme)
 * @param signerPubKey - The signer public key
 * @param signature - The signature { c, r }
 * @param curve - The curve to use
 * @param config - The signature config
 * @param keyPrefixing - Whether to prefix the hashed data with the public key (default: true)
 *
 * @returns true if the signature is valid, false otherwise
 */
export function verifySchnorrSignature(
  message: bigint,
  signerPubKey: Point,
  signature: { c: bigint; r: bigint },
  curve: Curve,
  config?: SignatureConfig,
  keyPrefixing = true,
): boolean {
  const G: Point = curve.GtoPoint(); // curve generator

  // compute H(m|[r*G - c*K]). Return true if the result is equal to c
  return (
    hash(
      (keyPrefixing ? formatPoint(signerPubKey, config) : "") +
        message +
        formatPoint(
          G.mult(signature.r).add(signerPubKey.mult(signature.c).negate()),
          config,
        ),
      config?.hash,
    ) === signature.c.toString(16)
  );
}
