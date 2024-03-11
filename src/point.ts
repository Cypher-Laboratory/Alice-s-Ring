import { Curve, CurveName } from "./curves";
import { ProjectivePoint as SECP256K1Point } from "./utils/noble-libraries/noble-SECP256k1";
import { ExtendedPoint as ED25519Point } from "./utils/noble-libraries/noble-ED25519";
import { modulo } from "./utils";
import {
  differentCurves,
  invalidParams,
  notOnCurve,
  unknownCurve,
} from "./errors";

/**
 * A point on the elliptic curve.
 */
export class Point {
  public curve: Curve;
  public x: bigint;
  public y: bigint;

  /**
   * Creates a point instance.
   *
   * @param curve - The curve
   * @param coordinates - The point coordinates ([x,y])
   * @param generator - if true, the point is a generator point
   * @param safeMode - if true, the point is checked to be on the curve
   *
   * @throws if the point is not on the curve
   *
   * @returns the point
   */
  constructor(curve: Curve, coordinates: [bigint, bigint], safeMode = true) {
    this.curve = curve;
    this.x = coordinates[0];
    this.y = coordinates[1];

    if (safeMode && !curve.isOnCurve([this.x, this.y])) {
      throw notOnCurve(`[${this.x}, ${this.y}]`);
    }
  }

  /**
   * Multiplies a scalar by a point on the elliptic curve.
   *
   * @param scalar - the scalar to multiply
   * @param point - the point to multiply
   *
   * @returns the result of the multiplication
   */
  mult(scalar: bigint): Point {
    if(scalar < 0n) throw invalidParams(`Scalar must be >= 0, but got ${scalar}`);
    if (scalar >= this.curve.N)
      throw invalidParams(
        `Scalar must be < N ${this.curve.N}, but got ${scalar}`,
      );
    switch (this.curve.name) {
      case CurveName.SECP256K1: {
        const result = SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(modulo(scalar, this.curve.N));
        const affine = result.toAffine();
        return new Point(this.curve, [affine.x, affine.y], false);
      }
      case CurveName.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(modulo(scalar, this.curve.N));

        const affine = result.toAffine();
        return new Point(this.curve, [affine.x, affine.y], false);
      }
      default: {
        throw unknownCurve(this.curve.name);
      }
    }
  }

  /**
   * Adds two points on the elliptic curve.
   *
   * @param point - the point to add
   * @returns the result of the addition as a new Point
   */
  add(point: Point): Point {
    if (this.curve.name !== point.curve.name)
      throw differentCurves("Cannot add points");

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

        const affine = result.toAffine();
        return new Point(this.curve, [affine.x, affine.y], false);
      }
      case CurveName.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).add(
          ED25519Point.fromAffine({
            x: point.x,
            y: point.y,
          }),
        );

        const affine = result.toAffine();
        return new Point(this.curve, [affine.x, affine.y], false);
      }
      default: {
        throw unknownCurve(this.curve.name);
      }
    }
  }

  /**
   * Checks if two points are equal.
   *
   * @param point - the point to compare to
   * @returns true if the points are equal, false otherwise
   */
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
        throw unknownCurve();
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

        const affine = result.toAffine();
        return new Point(this.curve, [affine.x, affine.y], false);
      }
      case CurveName.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).negate();

        const affine = result.toAffine();
        return new Point(this.curve, [affine.x, affine.y], false);
      }
      default: {
        throw unknownCurve("Cannot negate point");
      }
    }
  }

  /**
   * Converts a point to its affine representation.
   *
   * @returns the affine representation of the point
   */
  toCoordinates(): [bigint, bigint] {
    return [this.x, this.y];
  }

  /**
   * Converts a point to its json string representation.
   *
   * @returns the json string representation of the point
   */
  toString(): string {
    return JSON.stringify({
      curve: this.curve.toString(),
      x: this.x.toString(),
      y: this.y.toString(),
    });
  }

  /**
   * Converts a json string to a point.
   *
   * @param string - the json string representation of the point
   * @returns the point
   */
  static fromString(string: string): Point {
    const data = JSON.parse(string);
    return new Point(Curve.fromString(data.curve), [
      BigInt(data.x),
      BigInt(data.y),
    ]);
  }

  /**
   * Converts a point to its base64 string representation.
   */
  toBase64(): string {
    return Buffer.from(this.toString()).toString("base64");
  }

  /**
   * Converts a base64 string to a point.
   *
   * @param base64 - the base64 string representation of the point
   * @returns the point
   */
  static fromBase64(base64: string): Point {
    // decode base64
    const json = Buffer.from(base64, "base64").toString("ascii");
    return Point.fromString(json);
  }

  isValid(): boolean {
    try {
      this.curve.isOnCurve(this);
    } catch (error) {
      return false;
    }
    return true;
  }

  /**
   * Format a point according to the selected config
   *
   * @remarks
   * Default value is Point.toString()
   *
   * @param point - the point to format
   *
   * @returns the formatted point
   */
  serializePoint(): string {
    // convert x value to bytes and pad with 0 to 32 bytes
    const xBytes = this.x.toString(16).padStart(64, "0");
    // convert y value to bytes and pad with 0 to 32 bytes
    const yBytes = this.y.toString(16).padStart(64, "0");
    return xBytes + yBytes;
  }

  /**
   * Check if a point is a low order point
   *
   * @remarks
   * This function checks if the point is a low order point or a hybrid point
   *
   * @returns true if the point is not a low order point, false otherwise
   */
  checkLowOrder(): boolean {
    switch (this.curve.name) {
      // secp256k1 has a cofactor of 1 so no need to check for low order or hybrid points
      case CurveName.SECP256K1: {
        return true;
      }
      // ed25519 has a cofactor of 8 so we need to check for low order points
      // we check if (N-1)*P = -P (where P is the point and N is the order of the curve)
      // if true, the point is not low order or hybrid
      case CurveName.ED25519: {
        return this.mult(this.curve.N - 1n).equals(this.negate());
      }
      default: {
        throw unknownCurve(this.curve.name);
      }
    }
  }
}
