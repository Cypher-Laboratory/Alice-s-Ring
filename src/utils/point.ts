import { Curve, CurveName } from "./curves";
import { ProjectivePoint as SECP256K1Point } from "./noble-libraries/noble-SECP256k1";
import { ExtendedPoint as ED25519Point } from "./noble-libraries/noble-ED25519";
import { modulo } from ".";

/**
 * A point on the elliptic curve.
 */
export class Point {
  public curve: Curve;
  public x: bigint;
  public y: bigint;

  /**
   *
   *
   * @param curve - The curve
   * @param coordinates - The point coordinates ([x,y])
   * @param generator - if true, the point is a generator point
   */
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
    switch (this.curve.name) {
      case CurveName.SECP256K1: {
        const result = SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(modulo(scalar, this.curve.N));

        return new Point(this.curve, [result.x, result.y]);
      }
      case CurveName.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(modulo(scalar, this.curve.N));

        return new Point(this.curve, [result.x, result.y]);
      }
      default: {
        throw new Error("Unknown curve");
      }
    }
  }

  add(point: Point): Point {
    switch (this.curve.name) {
      case CurveName.SECP256K1: {
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
      case CurveName.ED25519: {
        // does not work
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

  equals(point: Point): boolean {
    if (this.curve !== point.curve) return false;

    switch (this.curve.name) {
      case CurveName.SECP256K1: {
        return SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).equals(
          SECP256K1Point.fromAffine({
            x: point.x,
            y: point.y,
          }),
        );
      }

      case CurveName.ED25519: {
        return ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).equals(
          ED25519Point.fromAffine({
            x: point.x,
            y: point.y,
          }),
        );
      }

      default: {
        throw new Error("Unknown curve");
      }
    }
  }

  /**
   * Negates a point on the elliptic curve.
   *
   * @param point - the point to negate
   *
   * @returns the negated point
   */
  negate(): Point {
    switch (this.curve.name) {
      case CurveName.SECP256K1: {
        const result = SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).negate();

        return new Point(this.curve, [result.x, result.y]);
      }
      case CurveName.ED25519: {
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

  toAffine(): [bigint, bigint] {
    return [this.x, this.y];
  }

  toString(): string {
    return JSON.stringify({
      curve: this.curve.toString(),
      x: this.x.toString(),
      y: this.y.toString(),
    });
  }

  static fromString(string: string): Point {
    const data = JSON.parse(string);
    return new Point(Curve.fromString(data.curve), [
      BigInt(data.x),
      BigInt(data.y),
    ]);
  }

  toBase64(): string {
    // save x, y and curve in json and encode it
    const json = JSON.stringify({
      x: this.x.toString(),
      y: this.y.toString(),
      curve: this.curve.toString(),
    });
    return Buffer.from(json).toString("base64");
  }

  static fromBase64(base64: string): Point {
    // decode base64
    const json = Buffer.from(base64, "base64").toString("ascii");
    const { x, y, curve } = JSON.parse(json);
    const retrievedCurve = Curve.fromString(curve);
    return new Point(retrievedCurve, [BigInt(x), BigInt(y)]);
  }
}
