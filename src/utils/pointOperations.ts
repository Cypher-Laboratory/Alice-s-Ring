import { Curve } from "./Curves";
import { ProjectivePoint } from "./noble-SECP256k1";

/**
 * Multiplies a scalar by a point on the elliptic curve.
 *
 * @param scalar - the scalar to multiply
 * @param point - the point to multiply
 * @returns the result of the multiplication
 */
export function mult(
  scalar: bigint,
  point: [bigint, bigint],
  curve: Curve = Curve.SECP256K1,
): [bigint, bigint] {
  switch (curve) {
    case Curve.SECP256K1: {
      const result = ProjectivePoint.fromAffine({
        x: point[0],
        y: point[1],
      }).mul(scalar);

      return [result.x, result.y];
    }
    case Curve.ED25519: {
      throw new Error("Not implemented");
    }
    default: {
      throw new Error("Unknown curve");
    }
  }
}

export function add(
  point1: [bigint, bigint],
  point2: [bigint, bigint],
  curve: Curve = Curve.SECP256K1,
): [bigint, bigint] {
  switch (curve) {
    case Curve.SECP256K1: {
      const result = ProjectivePoint.fromAffine({
        x: point1[0],
        y: point1[1],
      }).add(
        ProjectivePoint.fromAffine({
          x: point2[0],
          y: point2[1],
        }),
      );

      return [result.x, result.y];
    }
    case Curve.ED25519: {
      throw new Error("Not implemented");
    }
    default: {
      throw new Error("Unknown curve");
    }
  }
}

/**
 * Negates a point on the elliptic curve.
 *
 * @param point
 * @param curve
 *
 * @returns
 */
export function negate(
  point: [bigint, bigint],
  curve: Curve = Curve.SECP256K1,
): [bigint, bigint] {
  switch (curve) {
    case Curve.SECP256K1: {
      const result = ProjectivePoint.fromAffine({
        x: point[0],
        y: point[1],
      }).negate();

      return [result.x, result.y];
    }
    case Curve.ED25519: {
      throw new Error("Not implemented");
    }
    default: {
      throw new Error("Unknown curve");
    }
  }
}
