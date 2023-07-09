import {
  getRandomValues, // generation reellement aleatoire ?
} from "crypto";

export const randomBigint = (max: bigint): bigint => {
  const maxBytes = max.toString(16).length;
  const randomBytes = getRandomValues(new Uint8Array(maxBytes));
  const randomHex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const randomBig = BigInt("0x" + randomHex);
  return randomBig % max;
};

export function getRandomSecuredNumber(): number {
  const randomBytes = new Uint32Array(1);
  getRandomValues(randomBytes);
  return randomBytes[0] / 4294967295; // Divide by the maximum value to get a number between 0 and 1
}
