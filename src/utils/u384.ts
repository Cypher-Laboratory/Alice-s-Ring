import { Uint512 } from "starknet";

export interface Uint384 {
  limb0: bigint;
  limb1: bigint;
  limb2: bigint;
  limb3: bigint;
}

function toBigInt(str: string): bigint {
  if (str.startsWith("0x")) {
    // 0x-prefixed hexadecimal
    return BigInt(str);
  } else if (/^[0-9A-Fa-f]+$/.test(str)) {
    // Non-0x-prefixed hexadecimal
    return BigInt("0x" + str);
  } else {
    // Assume base 10
    return BigInt(str);
  }
}

export function ensureOddHexLength(hexValue: string, base: number): string {
  if (base === 16 && hexValue.length % 2 === 0) {
    console.log(hexValue);
    hexValue = "0" + hexValue;
  }
  return hexValue;
}

/*export function convertToBigInt(uint384: Uint384): bigint {
  const limb0 = toBigInt(uint384.limb0);
  const limb1 = toBigInt(uint384.limb1);
  const limb2 = toBigInt(uint384.limb2);
  const limb3 = toBigInt(uint384.limb3);

  // Calculate the shifts
  const shift96 = BigInt(2) ** BigInt(96);
  const shift192 = BigInt(2) ** BigInt(192);
  const shift288 = BigInt(2) ** BigInt(288);

  // Combine the limbs
  return limb0 + limb1 * shift96 + limb2 * shift192 + limb3 * shift288;
}
*/
export function convertToUint384(bigInt: bigint, base = 10): Uint384 {
  const mask96 = BigInt(2) ** BigInt(96) - BigInt(1);
  const limb0 = ensureOddHexLength((bigInt & mask96).toString(base), base);
  const limb1 = ensureOddHexLength(
    ((bigInt >> BigInt(96)) & mask96).toString(base),
    base,
  );
  const limb2 = ensureOddHexLength(
    ((bigInt >> BigInt(192)) & mask96).toString(base),
    base,
  );
  const limb3 = ensureOddHexLength(
    ((bigInt >> BigInt(288)) & mask96).toString(base),
    base,
  );

  return {
    limb0: BigInt(limb0),
    limb1: BigInt(limb1),
    limb2: BigInt(limb2),
    limb3: BigInt(limb3),
  };
}

export function u384Serialize(uint384: Uint384): bigint[] {
  const arr: bigint[] = [];
  arr.push(uint384.limb0);
  arr.push(uint384.limb1);
  arr.push(uint384.limb2);
  arr.push(uint384.limb3);
  return arr;
}
