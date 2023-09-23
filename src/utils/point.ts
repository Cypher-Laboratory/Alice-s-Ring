import { Curve } from "./curves";
import { ProjectivePoint as SECP256K1Point } from "./noble-libraries/noble-SECP256k1";
import { Point as ED25519Point } from "./noble-libraries/noble-ED25519";
import { modulo } from ".";

/**
 * A point on the elliptic curve.
 */
export class Point {
  public curve: Curve;
  public x: bigint;
  public y: bigint;

  constructor(curve: Curve, coordinates: [bigint, bigint]) {
    this.curve = curve;
    this.x = coordinates[0];
    this.y = coordinates[1];
  }

  /**
   * Multiplies a scalar by a point on the elliptic curve.
   *
   * @param scalar - the scalar to multiply
   * @param point - the point to multiply
   * @returns the result of the multiplication
   */
  mult(scalar: bigint): Point {
    switch (this.curve) {
      case Curve.SECP256K1: {
        const result = SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(scalar);

        return new Point(this.curve, [result.x, result.y]);
      }
      case Curve.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(scalar);

        return new Point(this.curve, [result.x, result.y]);
      }
      default: {
        throw new Error("Unknown curve");
      }
    }
  }

  add(point: Point, curve: Curve = Curve.SECP256K1): Point {
    switch (curve) {
      case Curve.SECP256K1: {
        const result = SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).add(
          SECP256K1Point.fromAffine({
            x: point.x,
            y: point.y,
          }),
        );

        return new Point(this.curve, [result.x, result.y]);
      }
      case Curve.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).add(
          ED25519Point.fromAffine({
            x: point.x,
            y: point.y,
          }),
        );

        return new Point(this.curve, [result.x, result.y]);
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
  negate(): Point {
    switch (this.curve) {
      case Curve.SECP256K1: {
        const result = SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).negate();

        return new Point(this.curve, [result.x, result.y]);
      }
      case Curve.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).negate();

        return new Point(this.curve, [result.x, result.y]);
      }
      default: {
        throw new Error("Unknown curve");
      }
    }
  }

  modulo(p: bigint): Point {
    return new Point(this.curve, [modulo(this.x, p), modulo(this.y, p)]);
  }

  toBigintArray(): [bigint, bigint] {
    return [this.x, this.y];
  }

  toString(): string {
    return String([this.x, this.y]);
  }
}
