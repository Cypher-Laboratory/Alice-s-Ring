/**
 * compute the modulo of two bigints
 *
 * @param n the bigint to compute the modulo of
 * @param p the modulo
 * @returns n mod p
 */
export function modulo(n: bigint, p: bigint): bigint {
  const result = n % p;
  return result >= 0n ? result : result + p;
}
