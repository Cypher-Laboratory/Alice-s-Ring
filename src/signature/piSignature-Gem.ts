/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/

import { ExtendedPoint as ED25519Point } from "../utils/noble-libraries/noble-ED25519";
import { ProjectivePoint as SECP256K1Point } from "../utils/noble-libraries/noble-SECP256k1";

function modulo(n: bigint, p: bigint): bigint {
  const result = n % p;
  return result >= 0n ? result : result + p;
}

/**
 * A point on the elliptic curve.
 */
class Point {
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

    if (safeMode) {
      switch (this.curve.name) {
        case CurveName.SECP256K1: {
          if (
            modulo(this.x ** 3n + 7n, curve.P) !== modulo(this.y ** 2n, curve.P)
          ) {
            throw new Error("Point is not on SECP256K1 curve");
          }
          break;
        }

        case CurveName.ED25519: {
          if (
            this.y ** 2n - this.x ** 2n ===
            1n - (121665n / 12666n) * this.x ** 2n * this.y ** 2n
          ) {
            throw new Error("Point is not on ED25519 curve");
          }
          break;
        }

        default: {
          console.warn("Unknown curve, cannot check if point is on curve");
        }
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
    switch (this.curve.name) {
      case CurveName.SECP256K1: {
        const result = SECP256K1Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(modulo(scalar, this.curve.P));

        return new Point(this.curve, [result.x, result.y]);
      }
      case CurveName.ED25519: {
        const result = ED25519Point.fromAffine({
          x: this.x,
          y: this.y,
        }).mul(modulo(scalar, this.curve.P));

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
}

/**
 * List of supported curves
 */
enum CurveName {
  SECP256K1 = "SECP256K1",
  ED25519 = "ED25519",
}

class Curve {
  name: CurveName; // curve name
  N: bigint; // curve order
  G: [bigint, bigint]; // generator point
  P: bigint; // field size

  /**
   * Creates a curve instance.
   *
   * @param curve - The curve name
   * @param params - The curve parameters (optional if curve is SECP256K1 or ED25519)
   */
  constructor(
    curve: CurveName,
    params?: { P: bigint; G: [bigint, bigint]; N: bigint },
  ) {
    this.name = curve;

    switch (this.name) {
      case CurveName.SECP256K1:
        this.G = SECP256K1.G;
        this.N = SECP256K1.N;
        this.P = SECP256K1.P;
        break;
      case CurveName.ED25519:
        this.G = ED25519.G;
        this.N = ED25519.N;
        this.P = ED25519.P;
        break;
      default:
        if (params) {
          this.G = params.G;
          this.N = params.N;
          this.P = params.P;
          break;
        }
        throw new Error("Invalid params");
    }
  }

  /**
   * Returns the generator point as a Point instance.
   *
   * @returns the generator point
   */
  GtoPoint(): Point {
    return new Point(this, this.G);
  }

  /**
   * Returns the curve as a json string.
   */
  toString(): string {
    return JSON.stringify({
      curve: this.name,
      Gx: this.G[0].toString(),
      Gy: this.G[1].toString(),
      N: this.N.toString(),
      P: this.P.toString(),
    });
  }

  /**
   * Returns a curve instance from a json string.
   *
   * @param curveData - the curve as a json string
   * @returns the curve instance
   */
  static fromString(curveData: string): Curve {
    const data = JSON.parse(curveData) as {
      curve: CurveName;
      Gx: string;
      Gy: string;
      N: string;
      P: string;
    };
    const G = [BigInt(data.Gx), BigInt(data.Gy)] as [bigint, bigint];
    const N = BigInt(data.N);
    const P = BigInt(data.P);
    return new Curve(data.curve, { P, G, N });
  }
}

// SECP256K1 curve constants
const SECP256K1 = {
  P: 2n ** 256n - 2n ** 32n - 977n,
  N: 2n ** 256n - 0x14551231950b75fc4402da1732fc9bebfn,
  G: [
    55066263022277343669578718895168534326250603453777594175500187360389116729240n,
    32670510020758816978083085130507043184471273380659243275938904335757337482424n,
  ] as [bigint, bigint],
};

// ED25519 curve constants
const ED25519 = {
  P: 2n ** 255n - 19n,
  N: 2n ** 252n + 27742317777372353535851937790883648493n, // curve's (group) order
  G: [ED25519Point.BASE.toAffine().x, ED25519Point.BASE.toAffine().y] as [
    bigint,
    bigint,
  ],
};

/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 * It is really close to a schnorr signature.
 *
 * @param nonce - the nonce to use
 * @param message - the message to sign
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
export function piSignature(
  nonce: bigint, // = alpha in our ring signature scheme
  message: bigint, // = c in our ring signature scheme
  signerPrivKey: bigint,
  curve: Curve,
): bigint {
  return modulo(nonce - message * signerPrivKey, curve.P);
}
