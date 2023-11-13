import { Curve, CurveName, RingSignature } from "../../src";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/**
 * Test the RingSignature.partialSigToBase64() method
 *
 * test if:
 * - the method returns a valid base64 encoded string
 * - the method's output can be used to create a valid PartialSignature
 */
describe("Test partialSigToBase64()", () => {
  it("Should return a valid base64 encoded string", () => {
    const ps = RingSignature.partialSign(
      data.publicKeys_secp256k1,
      data.message,
      data.signerPubKey_secp256k1,
      secp256k1,
    );

    expect(() => RingSignature.partialSigToBase64(ps)).not.toThrow();
    expect(typeof RingSignature.partialSigToBase64(ps)).toBe("string");
    expect(data.base64Regex.test(RingSignature.partialSigToBase64(ps))).toBe(
      true,
    );
  });
  it("Should return a valid PartialSignature object - secp256k1", () => {
    const ps = RingSignature.partialSigToBase64(
      RingSignature.partialSign(
        data.publicKeys_secp256k1,
        data.message,
        data.signerPubKey_secp256k1,
        secp256k1,
      ),
    );

    const rs = RingSignature.base64ToPartialSig(ps);

    expect(rs).toBeDefined();
    expect(rs.ring).toBeDefined();
    expect(rs.ring.length).toBe(data.publicKeys_secp256k1.length + 1); // +1 for the signerPubKey
    expect(rs.pi).toBeDefined();
    expect(rs.c).toBeDefined();
    expect(rs.cpi).toBeDefined();
    expect(rs.alpha).toBeDefined();
    expect(rs.responses).toBeDefined();
    expect(rs.curve).toBeDefined();
    expect(rs.curve.name).toBe(CurveName.SECP256K1);
    expect(rs.config).not.toBeDefined();
  });

  it("Should return a valid PartialSignature object - ed25519", () => {
    const ps = RingSignature.partialSigToBase64(
      RingSignature.partialSign(
        data.publicKeys_ed25519,
        data.message,
        data.signerPubKey_ed25519,
        ed25519,
      ),
    );

    const rs = RingSignature.base64ToPartialSig(ps);

    expect(rs).toBeDefined();
    expect(rs.ring).toBeDefined();
    expect(rs.ring.length).toBe(data.publicKeys_ed25519.length + 1); // +1 for the signerPubKey
    expect(rs.pi).toBeDefined();
    expect(rs.c).toBeDefined();
    expect(rs.cpi).toBeDefined();
    expect(rs.alpha).toBeDefined();
    expect(rs.responses).toBeDefined();
    expect(rs.curve).toBeDefined();
    expect(rs.curve.name).toBe(CurveName.ED25519);
    expect(rs.config).not.toBeDefined();
  });
});
