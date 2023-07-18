import crypto from 'crypto';

export const randomBigint = (max: bigint): bigint => {
  const maxBytes = max.toString(16).length;
  const array = crypto.randomBytes(maxBytes);
  const randomHex = array.toString('hex');
  const randomBig = BigInt("0x" + randomHex);
  return randomBig % max;
};

export function getRandomSecuredNumber(): number {
  const buffer = crypto.randomBytes(4); // 4 bytes = 32 bits
  const randomInt = buffer.readUInt32BE();
  const randomFloat = randomInt / 0xffffffff; // Divide by the maximum value to get a number between 0 and 1
  return randomFloat;
}