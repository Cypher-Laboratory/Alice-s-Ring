import { Curve, CurveName } from "../../src";
import { unknownCurve } from "../../src/errors";

/**
 * Test constructor
 *
 * test if:
 * - the method pass with valid parameters
 * - the method throws with invalid parameters
 */
describe("Test Curve constructor", () => {
  it("Should pass using valid values", () => {
    expect(() => {
      new Curve(CurveName.ED25519);
    }).not.toThrow();

    expect(() => {
      new Curve(CurveName.SECP256K1);
    }).not.toThrow();
  });

  it("Should throw using invalid name", () => {
    expect(() => {
      new Curve("invalid name" as CurveName);
    }).toThrow(unknownCurve("invalid name"));
  });
});
