import { randomBytes } from "node:crypto";
import { tooSmall } from "../errors";

export function randomBigint(max: bigint): bigint {
  if (max <= 0n) {
    throw tooSmall("Max", 0);
  }

  const byteSize = (max.toString(16).length + 1) >> 1;

  //we use a while loop as a safeguard against the case where the random number is greater than the max value
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const array = randomBytes(byteSize);
    const randomHex = array.toString("hex");
    const randomBig = BigInt("0x" + randomHex);

    if (randomBig < max) {
      return randomBig;
    }
  }
}

export function getRandomSecuredNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error("Min value should be less than or equal to max value.");
  }
  if (min < 0) {
    throw new Error("Min value should be greater than or equal to 0.");
  }
  if (max < 0) {
    throw new Error("Max value should be greater than or equal to 0.");
  }
  if (min === max) {
    return min;
  }

  const range = max - min + 1;
  const byteSize = Math.ceil(Math.log2(range) / 8);

  //we use a while loop as a safeguard against the case where the random number is greater than the max value
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const array = randomBytes(byteSize);
    const value = array.readUIntBE(0, byteSize);

    if (value < range) {
      return value + min;
    }
  }
}
