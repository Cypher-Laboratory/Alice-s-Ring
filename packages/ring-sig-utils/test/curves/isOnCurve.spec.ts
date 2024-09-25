import { Curve, CurveName } from "../../src";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/**
 * Test the Curve.toString() method
 *
 * test if:
 * - the method returns true if the point is on the curve
 * - the method returns false if the point is not on the curve
 */
describe("Test isOnCurve()", () => {
  it("Should return true if the point is on the curve - secp256k1", () => {
    expect(secp256k1.isOnCurve(secp256k1.GtoPoint())).toBe(true);
  });

  it("Should return true if the point is on the curve - ed25519", () => {
    expect(ed25519.isOnCurve(ed25519.GtoPoint())).toBe(true);
  });

  it("Should return false if the point is not on the curve - secp256k1", () => {
    expect(secp256k1.isOnCurve([1n, 1n])).toBe(false);
  });

  it("Should return false if the point is not on the curve - ed25519", () => {
    expect(ed25519.isOnCurve([1n, 1n])).toBe(false);
  });

  it("Should return true if the point is on the curve (from [bigint, bigint]) - secp256k1", () => {
    expect(secp256k1.isOnCurve(secp256k1.G)).toBe(true);
  });

  it("Should return true if the point is on the curve (from [bigint, bigint]) - ed25519", () => {
    expect(ed25519.isOnCurve(ed25519.G)).toBe(true);
  });
});
