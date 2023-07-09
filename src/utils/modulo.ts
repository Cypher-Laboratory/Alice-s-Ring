export function modulo(n: bigint, p: bigint): bigint { 
    const result = n % p;
    return result >= 0n ? result : result + p;
  }