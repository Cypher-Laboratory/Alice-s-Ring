import { convertToUint384, uint384Serialize } from "../../src";

describe("Uint384 Functions", () => {
  describe("convertToUint384", () => {
    it("should convert a valid bigint to Uint384", () => {
      const input = BigInt("1234567890123456789012345678901234567890");
      const expected = {
        limb0: 59687027581897032442218220242n,
        limb1: 15582437493n,
        limb2: 0n,
        limb3: 0n,
      };
      expect(convertToUint384(input)).toEqual(expected);
    });

    it("should throw an error for negative bigint", () => {
      expect(() => convertToUint384(BigInt(-1))).toThrow(
        "Input must be a non-negative bigint less than 2^384",
      );
    });

    it("should throw an error for bigint >= 2^384", () => {
      expect(() => convertToUint384(BigInt(2) ** BigInt(384))).toThrow(
        "Input must be a non-negative bigint less than 2^384",
      );
    });
  });

  describe("uint384Serialize", () => {
    it("should serialize Uint384 correctly", () => {
      const input = {
        limb0: BigInt(1),
        limb1: BigInt(2),
        limb2: BigInt(3),
        limb3: BigInt(4),
      };
      const expected = [BigInt(1), BigInt(2), BigInt(3), BigInt(4)];
      expect(uint384Serialize(input)).toEqual(expected);
    });
  });
});
