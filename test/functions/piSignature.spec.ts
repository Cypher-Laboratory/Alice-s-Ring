import { Curve, CurveName, piSignature } from "../../src";
import { invalidParams } from "../../src/errors";

const secp256k1 = new Curve(CurveName.SECP256K1);

/*
 * Test for piSignature function
 *
 * test if:
 * - piSignature() throw if alpha = 0
 * - piSignature() throw if c = 0
 * - piSignature() throw if signerPrivKey = 0
 */
describe("test piSignature()", () => {
  it("Should return a valid signature", () => {
    expect(() =>
      piSignature(
        BigInt(123456789),
        BigInt(123456789),
        BigInt(123456789),
        secp256k1,
      ),
    ).not.toThrow();
  });

  it("Should throw if alpha = 0", () => {
    expect(() =>
      piSignature(BigInt(0), BigInt(123456789), BigInt(123456789), secp256k1),
    ).toThrow(invalidParams());
  });

  it("Should throw if c = 0", () => {
    expect(() =>
      piSignature(BigInt(123456789), BigInt(0), BigInt(123456789), secp256k1),
    ).toThrow(invalidParams());
  });

  it("Should throw if signerPrivKey = 0", () => {
    expect(() =>
      piSignature(BigInt(123456789), BigInt(123456789), BigInt(0), secp256k1),
    ).toThrow(invalidParams());
  });
});
