export interface Uint384 {
  limb0: bigint;
  limb1: bigint;
  limb2: bigint;
  limb3: bigint;
}

const MASK96 = BigInt(2) ** BigInt(96) - BigInt(1);

/**
 *
 * Convert a bigint into a Uint384
 *
 * @param bigInt the bigint value to convert
 * @returns a Uint384 representation of the bigint
 */
export function convertToUint384(bigInt: bigint): Uint384 {
  if (bigInt < 0 || bigInt >= BigInt(2) ** BigInt(384)) {
    throw new Error("Input must be a non-negative bigint less than 2^384");
  }
  return {
    limb0: bigInt & MASK96,
    limb1: (bigInt >> BigInt(96)) & MASK96,
    limb2: (bigInt >> BigInt(192)) & MASK96,
    limb3: (bigInt >> BigInt(288)) & MASK96,
  };
}

/**
 * Serialize a U384 following the U384Serde from garaga
 * https://github.com/keep-starknet-strange/garaga/blob/6135bd6dec063851a8249e1dafc8a7e4c98abf9d/src/src/definitions.cairo#L10
 *
 * @param uint384 the uint384 to serialize
 * @returns a bigint[] containing the serialized value
 */
export function uint384Serialize(uint384: Uint384): readonly bigint[] {
  return [uint384.limb0, uint384.limb1, uint384.limb2, uint384.limb3];
}
