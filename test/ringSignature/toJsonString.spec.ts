import { Curve, CurveName, RingSignature } from "../../src";
import * as points from "../points";
import * as message from "../message";

const secp256k1 = new Curve(CurveName.SECP256K1);
/**
 * Test the RingSignature.fromJsonString() method
 *
 * test if:
 * - the method returns a valid json string
 * - the method's output can be used to create a valid RingSignature
 */
describe("Test toJsonString()", () => {
  it("Should return a valid json string", () => {
    const rs = new RingSignature(
      message.message,
      points.publicKeys_secp256k1,
      points.randomC,
      points.randomResponses,
      secp256k1,
    );
    expect(() => JSON.parse(rs.toJsonString())).not.toThrow();
  });
  it("Should return a valid RingSignature", () => {
    const rs = new RingSignature(
      message.message,
      points.publicKeys_secp256k1,
      points.randomC,
      points.randomResponses,
      secp256k1,
    );
    expect(RingSignature.fromJsonString(rs.toJsonString())).toBeInstanceOf(
      RingSignature,
    );
  });
});
