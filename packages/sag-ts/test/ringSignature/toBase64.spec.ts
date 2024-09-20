import { Curve, CurveName } from "@cypher-laboratory/ring-sig-utils";
import { RingSignature } from "../../src/ringSignature";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);
/**
 * Test the RingSignature.fromJsonString() method
 *
 * test if:
 * - the method returns a valid base64 encoded string
 * - the method's output can be used to create a valid RingSignature using fromBase64(str)
 */
describe("Test toBase64()", () => {
  it("Should return a valid base64 encoded string", () => {
    const rs = new RingSignature(
      data.message,
      data.publicKeys_secp256k1,
      data.randomC,
      data.randomResponses,
      secp256k1,
    );
    expect(() => Buffer.from(rs.toBase64(), "base64")).not.toThrow();
  });

  it("Should return a valid RingSignature", () => {
    const rs = new RingSignature(
      data.message,
      data.publicKeys_secp256k1,
      data.randomC,
      data.randomResponses,
      secp256k1,
    );
    expect(RingSignature.fromBase64(rs.toBase64())).toBeInstanceOf(
      RingSignature,
    );
  });
});
