import { RingSignature } from "../../src";
import { Curve, CurveName, ecHash } from "@cypher-laboratory/ring-sig-utils";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);
/**
 * Test the RingSignature.toJsonString() method
 *
 * test if:
 * - the method returns a valid json string
 * - the method's output can be used to create a valid RingSignature
 */
describe("Test toJsonString()", () => {
  it("Should return a valid json string", () => {
    const customMapped = ecHash(
      [data.signerPubKey_secp256k1.serialize()].concat(
        data.linkabilityFlag ? [data.linkabilityFlag] : [],
      ),
      secp256k1,
      // config,
    );

    const keyImage = customMapped.mult(data.signerPrivKey);

    const rs = new RingSignature(
      data.message,
      data.publicKeys_secp256k1,
      data.randomC,
      data.randomResponses,
      secp256k1,
      keyImage,
      data.linkabilityFlag,
    );
    expect(() => JSON.parse(rs.toJsonString())).not.toThrow();
  });
  it("Should return a valid RingSignature", () => {
    const customMapped = ecHash(
      [data.signerPubKey_secp256k1.serialize()].concat(
        data.linkabilityFlag ? [data.linkabilityFlag] : [],
      ),
      secp256k1,
      // config,
    );

    const keyImage = customMapped.mult(data.signerPrivKey);

    const rs = new RingSignature(
      data.message,
      data.publicKeys_secp256k1,
      data.randomC,
      data.randomResponses,
      secp256k1,
      keyImage,
      data.linkabilityFlag,
    );
    expect(RingSignature.fromJsonString(rs.toJsonString())).toBeInstanceOf(
      RingSignature,
    );
  });
});
