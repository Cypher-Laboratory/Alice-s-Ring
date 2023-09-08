export { P, G, Gx, Gy, l } from "./curveConst";
export { randomBigint, getRandomSecuredNumber } from "./randomNumbers";
export { modulo } from "./modulo";

export enum Curve {
  SECP256K1 = "SECP256K1",
  ED25519 = "ED25519",
}
