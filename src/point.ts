import { Curve, CurveName } from "./curves";
import { ProjectivePoint as SECP256K1Point } from "./utils/noble-libraries/noble-SECP256k1";
import {
  ExtendedPoint as ED25519Point,
  uvRatio,
} from "./utils/noble-libraries/noble-ED25519";
import { modPow, modulo } from "./utils";
import {
  differentCurves,
  invalidParams,
  notOnCurve,
  unknownCurve,
} from "./errors";
import { keccak_256 } from "@noble/hashes/sha3";
import { convertToUint384, Uint384 } from "./utils";
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
    if (scalar < 0n)
      throw invalidParams(`Scalar must be >= 0, but got ${scalar}`);
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

  toU384Coordinates(): [Uint384, Uint384] {
    return [convertToUint384(this.x), convertToUint384(this.y)];
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
      return this.curve.isOnCurve(this);
    } catch (error) {
      return false;
    }
  }

  /**
   * serialize a point to a hex string
   *
   * @param point - the point to format
   *
   * @returns the formatted point
   */
  serialize(): string {
    switch (this.curve.name) {
      case CurveName.SECP256K1: {
        return (
          (this.y % 2n === 0n ? "02" : "03") +
          this.x.toString(16).padStart(64, "0")
        );
      }
      case CurveName.ED25519: {
        return (
          "ED" + (this.x % 2n === 0n ? "02" : "03") + this.y.toString(16) //.padStart(64, "0")
        );
      }
      default: {
        throw unknownCurve("Cannot compress point: unknown curve");
      }
    }
  }

  /**
   * deserialize a point from a hex string
   *
   * @param hex - the hex string to deserialize
   *
   * @returns the deserialized point
   */
  static deserialize(compressed: string): Point {
    let curveName: CurveName;
    if (compressed.startsWith("ED")) {
      curveName = CurveName.ED25519;
    } else if (compressed.startsWith("02") || compressed.startsWith("03")) {
      curveName = CurveName.SECP256K1;
    } else {
      throw unknownCurve("Cannot decompress point: unknown curve");
    }

    const curve = new Curve(curveName);

    // compute y
    switch (curve.name) {
      case CurveName.SECP256K1: {
        const x = BigInt("0x" + compressed.slice(2));

        // since SECP256K1.P % 4 = 3, sqrt(x) = x ** ((P + 1) / 4) (mod P)
        const y = modPow(
          modulo(modPow(x, 3n, curve.P) + 7n, curve.P),
          (curve.P + 1n) / 4n,
          curve.P,
        );
        const prefix = compressed.slice(0, 2);
        // check if y is even or odd
        if (
          (prefix === "02" && y % 2n === 1n) ||
          (prefix === "03" && y % 2n === 0n)
        ) {
          return new Point(curve, [x, curve.P - y]);
        } else {
          return new Point(curve, [x, y]);
        }
      }
      case CurveName.ED25519: {
        const y = BigInt("0x" + compressed.slice(4));

        // This part of the code is taken from noble-ed25519
        const d =
          -4513249062541557337682894930092624173785641285191125241628941591882900924598840740n;
        const y2 = modulo(y * y, curve.P); // y²
        const u = modulo(y2 - 1n, curve.P); // u=y²-1
        const v = modulo(d * y2 + 1n, curve.P); // v=dy²+1
        const { isValid, value } = uvRatio(u, v); // (uv³)(uv⁷)^(p-5)/8; square root
        if (!isValid) throw new Error("bad y coordinate"); // not square root: bad point
        // end of noble code

        // check if y is even or odd
        if (value % BigInt(2) ? "03" : "02" === compressed.slice(2, 4)) {
          return new Point(curve, [value, y]);
        } else {
          return new Point(curve, [curve.P - value, y]);
        }
      }
      default: {
        throw unknownCurve("Cannot decompress point: unknown curve");
      }
    }
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
      // we check if the point is not the point at infinity (0,0) in affine coordinates
      case CurveName.SECP256K1: {
        return this.equals(new Point(this.curve, [0n, 0n], false)) === false;
      }
      // ed25519 has a cofactor of 8 so we need to check for low order points
      // we check if (N-1)*P = -P (where P is the point and N is the order of the curve)
      // we check if the point is not the point at infinity (0,1) in affine coordinates
      // if true, the point is not low order or hybrid
      case CurveName.ED25519: {
        return (
          this.mult(this.curve.N - 1n).equals(this.negate()) &&
          this.equals(new Point(this.curve, [0n, 1n], false)) === false
        );
      }
      default: {
        throw unknownCurve(this.curve.name);
      }
    }
  }
  /**
   * Get an Ethereum address from a point
   *
   * @returns an ethereum address
   */
  toEthAddress(): string {
    // Convert points (x, y) to Buffer
    const xBuffer = Buffer.from(this.x.toString(16).padStart(64, "0"), "hex");
    const yBuffer = Buffer.from(this.y.toString(16).padStart(64, "0"), "hex");

    // Concatenate x and y to form public key
    const publicKey = Buffer.concat([xBuffer, yBuffer]);

    // Hash the public key with Keccak-256
    const hash = Buffer.from(keccak_256(publicKey));

    // Take the last 20 bytes of the hash and convert to an Ethereum address
    const ethereumAddress = "0x" + hash.slice(-20).toString("hex");

    return ethereumAddress;
  }
}
