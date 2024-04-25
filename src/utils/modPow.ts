/**
 * Computes (base^exponent) % modulus
 *
 * @param base - The base
 * @param exponent - The exponent
 * @param modulus - The modulus
 *
 * @returns - The result of (base^exponent) % modulus
 */
export function modPow(
  base: bigint,
  exponent: bigint,
  modulus: bigint,
): bigint {
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
}