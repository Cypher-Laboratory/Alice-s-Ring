import { Curve, CurveName, RingSignature } from "../../src";
import { ecHash } from "@cypher-laboratory/ring-sig-utils";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);
/**
 * Test the RingSignature.fromJson() method
 *
 * test if:
 * - the method returns a valid base64 encoded string
 * - the method's output can be used to create a valid RingSignature using fromBase64(str)
 */
describe("Test toBase64()", () => {
  it("Should return a valid base64 encoded string", () => {
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
    expect(() => Buffer.from(rs.toBase64(), "base64")).not.toThrow();
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
    expect(RingSignature.fromBase64(rs.toBase64())).toBeInstanceOf(
      RingSignature,
    );
  });
});
