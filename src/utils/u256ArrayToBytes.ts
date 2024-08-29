function u256ToBytes(u256: bigint): Uint8Array {
  const buffer = new ArrayBuffer(32);
  const view = new DataView(buffer);

  for (let i = 0; i < 32; i++) {
    view.setUint8(31 - i, Number(u256 & 255n));
    u256 >>= 8n;
  }

  return new Uint8Array(buffer);
}

export function u256ArrayToBytes(u256Array: bigint[]): Uint8Array {
  // Use the single conversion function on each element and concatenate results
  const result: number[] = [];
  for (const u256 of u256Array) {
    const bytes = u256ToBytes(u256);
    result.push(...bytes);
  }

  return new Uint8Array(result);
}
