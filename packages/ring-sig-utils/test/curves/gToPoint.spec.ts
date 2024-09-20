import { Curve, CurveName, Point } from "../../src";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/**
 * Test the Curve.GToPoint() method
 *
 * test if:
 * - the method returns a point on the curve
 */
describe("Test GtoPoint()", () => {
  it("Should return a point on the same curve - secp256k1", () => {
    const G = secp256k1.GtoPoint();
    expect(G).toBeInstanceOf(Point);
    expect(G.curve).toBe(secp256k1);
  });

  it("Should return a point on the same curve - ed25519", () => {
    const G = ed25519.GtoPoint();
    expect(G).toBeInstanceOf(Point);
    expect(G.curve).toBe(ed25519);
  });
});
