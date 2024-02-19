import { Curve, CurveName } from "../../src";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/**
 * Test the Curve.toString() method
 *
 * test if:
 * - the method returns a stringified curve
 */
describe("Test toString()", () => {
  it("Should return a stringified curve - secp256k1", () => {
    expect(secp256k1.toString()).toBe(
      // eslint-disable-next-line max-len
  '{\"curve\":\"SECP256K1\"}'    
  );
  });

  it("Should return a stringified curve - ed25519", () => {
    expect(ed25519.toString()).toBe(
      // eslint-disable-next-line max-len
      '{\"curve\":\"ED25519\"}',
    );
  });
});
