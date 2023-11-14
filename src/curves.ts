import {
  ExtendedPoint,
  Gx,
  Gy,
  mod,
} from "./utils/noble-libraries/noble-ED25519";
import { Point } from "./point";
import { modulo } from "./utils";
import { invalidParams, unknownCurve } from "./errors";

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
const GED25519 = new ExtendedPoint(Gx, Gy, 1n, mod(Gx * Gy));
const ED25519 = {
  P: 2n ** 255n - 19n,
  N: 2n ** 252n + 27742317777372353535851937790883648493n, // curve's (group) order
  G: [GED25519.toAffine().x, GED25519.toAffine().y] as [bigint, bigint],
};

/**
 * List of supported curves
 */
export enum CurveName {
  SECP256K1 = "SECP256K1",
  ED25519 = "ED25519",
}

export class Curve {
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
  constructor(curve: CurveName) {
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
      default: {
        throw unknownCurve(curve);
      }
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
    };
    return new Curve(data.curve);
  }

  /**
   * Checks if a point is on the curve.
   *
   * @param point - the point to check
   * @returns true if the point is on the curve, false otherwise
   */
  isOnCurve(point: Point | [bigint, bigint]): boolean {
    let x: bigint;
    let y: bigint;
    if (point instanceof Point) {
      x = point.x;
      y = point.y;
    } else {
      x = point[0];
      y = point[1];
    }

    if (x === 0n || y === 0n)
      throw invalidParams("Point is not on curve: " + point);

    switch (this.name) {
      case CurveName.SECP256K1: {
        return modulo(x ** 3n + 7n - y ** 2n, this.P) === 0n;
      }
      case CurveName.ED25519: {
        const d =
          -4513249062541557337682894930092624173785641285191125241628941591882900924598840740n;
        return (
          modulo(y ** 2n - x ** 2n - 1n - d * x ** 2n * y ** 2n, this.P) === 0n
        );
      }

      default: {
        console.warn(
          "Unknown curve, cannot check if point is on curve. Returning true.",
        );
      }
    }

    return true;
  }

  equals(curve: Curve): boolean {
    return (
      this.name === curve.name &&
      this.G[0] === curve.G[0] &&
      this.G[1] === curve.G[1] &&
      this.N === curve.N &&
      this.P === curve.P
    );
  }
}

/**
 * Derive the public key from the private key.
 *
 * @param privateKey - the private key
 * @param curve - the curve to use
 * @param config - the config to use (optional)
 *
 * @returns the public key
 */
export function derivePubKey(privateKey: bigint, curve: Curve): Point {
  return curve.GtoPoint().mult(privateKey);
}
