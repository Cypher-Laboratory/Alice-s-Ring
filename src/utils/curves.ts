import { ExtendedPoint } from "./noble-libraries/noble-ED25519";
import { Point } from "./point";

/**
 * List of supported curves
 */
export enum CurveName {
  SECP256K1 = "SECP256K1",
  ED25519 = "ED25519",
  CUSTOM = "CUSTOM",
}

export class Curve {
  name: CurveName; // curve name
  N: bigint; // curve order
  G: [bigint, bigint]; // generator point
  P: bigint; //

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

  GtoPoint(): Point {
    return new Point(this, this.G);
  }

  toString(): string {
    return JSON.stringify({
      curve: this.name,
      Gx: this.G[0].toString(),
      Gy: this.G[1].toString(),
      N: this.N.toString(),
      P: this.P.toString(),
    });
  }

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
  G: [ExtendedPoint.BASE.toAffine().x, ExtendedPoint.BASE.toAffine().y] as [
    bigint,
    bigint,
  ],
};
