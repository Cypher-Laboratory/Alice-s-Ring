import { ProjectivePoint } from "./noble";

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

export function add(point1: [bigint, bigint], point2: [bigint, bigint]): [bigint, bigint] {
  const result = ProjectivePoint.fromAffine(
    {
      x: point1[0],
      y: point1[1],
    }
  )
    .add(ProjectivePoint.fromAffine(
      {
        x: point2[0],
        y: point2[1],
      }
    ));

  return [result.x, result.y];
}
