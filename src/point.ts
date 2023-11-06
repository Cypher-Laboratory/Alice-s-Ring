import { Curve, CurveName } from "./curves";
import { ProjectivePoint as SECP256K1Point } from "./utils/noble-libraries/noble-SECP256k1";
import { ExtendedPoint as ED25519Point } from "./utils/noble-libraries/noble-ED25519";
import { modulo } from "./utils";
import * as elliptic from "elliptic";
import { checkPoint } from "./ringSignature";

const Ed25519 = new elliptic.eddsa("ed25519");
const secp256k1 = new elliptic.ec("secp256k1");

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
      throw new Error("Point is not on the curve");
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

  /**
   * Adds two points on the elliptic curve.
   *
   * @param point - the point to add
   * @returns the result of the addition as a new Point
   */
  add(point: Point): Point {
    if (this.curve.name !== point.curve.name)
      throw new Error("Cannot add points: different curves");

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

  /**
   * Converts a point to its affine representation.
   *
   * @returns the affine representation of the point
   */
  toAffine(): [bigint, bigint] {
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
    // save x, y and curve in json and encode it
    const json = JSON.stringify({
      x: this.x.toString(),
      y: this.y.toString(),
      curve: this.curve.toString(),
    });
    return Buffer.from(json).toString("base64");
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
    const { x, y, curve } = JSON.parse(json);
    const retrievedCurve = Curve.fromString(curve);
    return new Point(retrievedCurve, [BigInt(x), BigInt(y)]);
  }

  /**
   * Converts a hex public key (XRPL standard) to a Point object.
   *
   * @param hex the hex string representation of the public key XRPL Format
   * @returns the point
   *
   */
  static fromHexXRPL(hex: string): Point {
    // Check which curve we are on
    if (hex.startsWith("ED")) {
      // Compute on ed25519
      try {
        // Use the `curve.keyFromPublic` method to create a Keypair based on the signing pubkey
        // The keypair is encoded
        // Get ride of the ED prefix indicating that the curve is on ed25519
        const keypair = Ed25519.keyFromPublic(hex.slice(2));
        // get the X and Y value by decoding the point
        const xValue = Ed25519.decodePoint(keypair.getPublic())
          .getX()
          .toString(16);
        const yValue = Ed25519.decodePoint(keypair.getPublic())
          .getY()
          .toString(16);
        return new Point(new Curve(CurveName.ED25519), [
          BigInt("0x" + xValue),
          BigInt("0x" + yValue),
        ]);
      } catch (error) {
        throw new Error(
          "Error while computing coordinates on ed25519: " + error,
        );
      }
    } else {
      // Compute on secp256k1
      try {
        // Use the `curve.pointFromX()` method to retrieve the point on the curve
        // Get ride of the prefix (02/03) that indicate if y coordinate is odd or not
        // see xrpl doc here : https://xrpl.org/cryptographic-keys.html
        const point = secp256k1.curve.pointFromX(hex.slice(2));
        // Access the y-coordinate from the retrieved point
        const xValue = point.getX().toString(16);
        const yValue = point.getY().toString(16);
        return new Point(new Curve(CurveName.ED25519), [
          BigInt("0x" + xValue),
          BigInt("0x" + yValue),
        ]);
      } catch (error) {
        throw new Error(
          "Error while computing coordinates on secp256k1: " + error,
        );
      }
    }
  }

  isValid(): boolean {
    try {
      checkPoint(this);
    } catch (error) {
      return false;
    }
    return true;
  }
}
