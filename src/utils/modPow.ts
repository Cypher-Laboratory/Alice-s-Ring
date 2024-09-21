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
  if (modulus === 1n) return 0n;

  let result = 1n;
  base = base % modulus;

  if (exponent < 0n) {
    // Handle negative exponent (modular division)
    return modDiv(1n, modPow(base, -exponent, modulus), modulus);
  }

  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }

  return result;
}

// Helper function for modular division
function modDiv(a: bigint, b: bigint, m: bigint): bigint {
  // Assume m is prime for Fermat's Little Theorem
  return (a * modPow(b, m - 2n, m)) % m;
}
