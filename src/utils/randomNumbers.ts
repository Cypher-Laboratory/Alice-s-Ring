import { randomBytes } from "node:crypto";

export function randomBigint(max: bigint): bigint {
  const maxBytes = max.toString(16).length;
  const array = randomBytes(maxBytes);
  const randomHex = array.toString("hex");
  const randomBig = BigInt("0x" + randomHex);
  return randomBig % max;
}

export function getRandomSecuredNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
