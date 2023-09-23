import { Curve, ED25519, SECP256K1 } from "./curves";
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
  public P: bigint;
  public G: [bigint, bigint];

  /**
   *
   *
   * @param curve - The curve
   * @param coordinates - The point coordinates ([x,y])
   * @param generator - if true, the point is a generator point
   */
  constructor(
    curve: Curve,
    coordinates: [bigint, bigint],
    P?: bigint,
    G?: [bigint, bigint],
  ) {
    this.curve = curve;
    this.x = coordinates[0];
    this.y = coordinates[1];
    switch (curve) {
      case Curve.SECP256K1: {
        this.P = SECP256K1.P;
        this.G = SECP256K1.G;
        break;
      }
      case Curve.ED25519: {
        this.P = ED25519.P;
        this.G = ED25519.G;
        break;
      }
      default: {
        if (!P || !G) {
          throw new Error("Unknown curve");
        }
        this.P = P;
        this.G = G;
      }
    }
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
        }).mul(modulo(scalar, SECP256K1.N));

        return new Point(this.curve, [result.x, result.y]);
      }
      case Curve.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(modulo(scalar, ED25519.N));

        return new Point(this.curve, [result.x, result.y]);
      }
      default: {
        throw new Error("Unknown curve");
      }
    }
  }

  add(point: Point): Point {
    switch (this.curve) {
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

  /**
   * Negates a point on the elliptic curve.
   *
   * @param point - the point to negate
   *
   * @returns the negated point
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

  toAffine(): [bigint, bigint] {
    return [this.x, this.y];
  }

  toString(): string {
    return String([this.x, this.y]);
  }

  toBase64(): string {
    // save x, y and curve in json and encode it
    const json = JSON.stringify({
      x: this.x.toString(),
      y: this.y.toString(),
      curve: this.curve,
    });
    return Buffer.from(json).toString("base64");
  }

  static fromBase64(base64: string): Point {
    // decode base64
    const json = Buffer.from(base64, "base64").toString("ascii");
    const { x, y, curve } = JSON.parse(json);
    return new Point(curve, [BigInt(x), BigInt(y)]);
  }
}
