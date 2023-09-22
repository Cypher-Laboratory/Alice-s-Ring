/**
 * List of supported curves
 */
export enum Curve {
  SECP256K1 = "SECP256K1",
  ED25519 = "ED25519",
}

// SECP256K1 curve constants
export const P: bigint = 2n ** 256n - 2n ** 32n - 977n;
export const Gx =
  55066263022277343669578718895168534326250603453777594175500187360389116729240n;
export const Gy =
  32670510020758816978083085130507043184471273380659243275938904335757337482424n;
export const G: [bigint, bigint] = [Gx, Gy];
