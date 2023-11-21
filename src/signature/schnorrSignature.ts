/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
import { modulo, hash, formatPoint, randomBigint, formatRing } from "../utils";
import { Point } from "../point";
import { Curve, derivePubKey } from "../curves";
import { SignatureConfig } from "../interfaces";

/**
 * Compute a Schnorr signature
 *
 * @param message - The message digest (as bigint)
 * @param signerPrivKey - The signer private key
 * @param curve - The curve to use
 * @param alpha - The alpha value (optional)
 * @param config - The signature config (optional)
 * @param ring - The ring used for signing (only needed in case of ring signature context)(optional)
 * @param keyPrefixing - Whether to prefix the hashed data with the public key (default: true)
 *
 * @returns { messageDigest: bigint, c: bigint, r: bigint,  ring?: Point[] } - The signature { messageDigest, c, r, ring? }
 */
export function schnorrSignature(
  message: bigint,
  signerPrivKey: bigint,
  curve: Curve,
  alpha?: bigint,
  config?: SignatureConfig,
  ring?: Point[],
  keyPrefixing = true,
): { messageDigest: bigint; c: bigint; r: bigint; ring?: Point[] } {
  if (!alpha) alpha = randomBigint(curve.N);

  const c = modulo(
    BigInt(
      "0x" +
        hash(
          (keyPrefixing && !ring
            ? formatPoint(derivePubKey(signerPrivKey, curve))
            : "") +
            (ring ? formatRing(ring) : "") +
            message +
            formatPoint(curve.GtoPoint().mult(alpha)),
          config?.hash,
        ),
    ),
    curve.N,
  );

  const r = modulo(alpha + c * signerPrivKey, curve.N);

  return { messageDigest: message, c, r, ring: ring };
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
  signature: { c: bigint; r: bigint; ring?: Point[] },
  curve: Curve,
  config?: SignatureConfig,
  keyPrefixing = true,
): boolean {
  const G: Point = curve.GtoPoint(); // curve generator
  // compute H(R|m|[r*G - c*K]) (R is empty, signerPubkey or the ring used for signing). Return true if the result is equal to c
  const point = G.mult(signature.r).add(
    signerPubKey.mult(signature.c).negate(),
  );

  const h = modulo(
    BigInt(
      "0x" +
        hash(
          (keyPrefixing && !signature.ring ? formatPoint(signerPubKey) : "") +
            (signature.ring ? formatRing(signature.ring) : "") +
            message +
            formatPoint(point),
          config?.hash,
        ),
    ),
    curve.N,
  );
  return h === signature.c;
}
