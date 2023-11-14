import { Curve, CurveName } from "../../src";
import { curveMismatch, notOnCurve } from "../../src/errors";
import { checkPoint } from "../../src/ringSignature";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/*
 * Test for checkPoint function
 *
 * test if:
 * - checkPoint() returns void if the point is valid
 * - checkPoint() throws if the point is not on the curve
 * - checkPoint() throws if the point's curve is not the specified curve
 */
describe("test checkPoint()", () => {
  it("Should return true if the point is valid", () => {
    const point = secp256k1.GtoPoint();
    expect(() => checkPoint(point)).not.toThrow();
  });

  it("Should throw if the point is not on the curve", () => {
    const point = secp256k1.GtoPoint();
    point.x = BigInt(123456789);
    expect(() => checkPoint(point)).toThrow(notOnCurve());
  });

  it("Should throw if the point's curve is not the specified curve", () => {
    const point = secp256k1.GtoPoint();
    expect(() => checkPoint(point, ed25519)).toThrow(curveMismatch());
  });
});
