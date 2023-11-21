import { modulo, hash, formatPoint, randomBigint, formatRing } from ".";
import { Point } from "../point";
import { SignatureConfig } from "../interfaces";
import { Curve } from "../curves";

/**
 * Compute the value of Cpi+1
 *
 * @param message the message to sign digested
 * @param curve the curve to use
 * @param alpha the nonce value
 * @param config the config to use
 * @param ring the ring involved in the ring signature
 *
 * @returns the value of c1
 */
export function computeCPI1(
  message: bigint, // = c in our ring signature scheme
  curve: Curve,
  alpha?: bigint,
  config?: SignatureConfig,
  ring?: Point[],
): bigint {
  if (!alpha) alpha = randomBigint(curve.N);

  const c = modulo(
    BigInt(
      "0x" +
        hash(
          (ring ? formatRing(ring) : "") +
            message +
            formatPoint(curve.GtoPoint().mult(alpha)),
          config?.hash,
        ),
    ),
    curve.N,
  );

  return c;
}
