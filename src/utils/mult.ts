import { ProjectivePoint } from "./noble";
import { getPublicKey } from "./getPubkey";
import { Curve, G } from ".";

/**
 * Multiplies a scalar by a point on the elliptic curve.
 * 
 * @param scalar - the scalar to multiply
 * @param point - the point to multiply
 * @returns the result of the multiplication
 */
export function mult(scalar: bigint, point: [bigint, bigint]): [bigint, bigint] {
  const result = ProjectivePoint.fromAffine(
    {
      x: point[0],
      y: point[1],
    }
  )
    .mul(scalar);

  return [result.x, result.y];

}
