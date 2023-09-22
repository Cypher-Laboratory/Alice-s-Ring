export function modulo(n: bigint | [bigint, bigint], p: bigint): bigint | [bigint, bigint] {
  if(Array.isArray(n)) {
    return n.map((coord) => modulo(coord, p)) as [bigint, bigint];
  }
  const result = n % p;
  return result >= 0n ? result : result + p;
}
