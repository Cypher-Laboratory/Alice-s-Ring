import { Curve, CurveName, RingSignature } from "../../src";
import { decrypt } from "../../src/encryption/encryption";
import { invalidBase64 } from "../../src/errors";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/**
 * Test the RingSignature.partialSigToBase64() method
 *
 * test if:
 * - the method returns a valid base64 encoded string
 * - the method's output can be used to create a valid PartialSignature
 * - the method throws an error if the input is not a valid base64 encoded string
 */
describe("Test partialSigToBase64()", () => {
  it("Should return a valid base64 encoded string", () => {
    const enc_ps = RingSignature.partialSign(
      data.publicKeys_secp256k1,
      data.message,
      data.signerPubKey_secp256k1,
      secp256k1,
      data.signerEncryptionPubKey,
    );

    const ps = RingSignature.base64ToPartialSig(
      decrypt(enc_ps, data.signerPrivKey),
    );

    expect(() => RingSignature.partialSigToBase64(ps)).not.toThrow();
    expect(typeof RingSignature.partialSigToBase64(ps)).toBe("string");
    expect(data.base64Regex.test(RingSignature.partialSigToBase64(ps))).toBe(
      true,
    );
  });

  it("Should return a valid PartialSignature object - secp256k1", () => {
    const enc_rs = RingSignature.partialSign(
      data.publicKeys_secp256k1,
      data.message,
      data.signerPubKey_secp256k1,
      secp256k1,
      data.signerEncryptionPubKey,
    );

    const rs = RingSignature.base64ToPartialSig(
      decrypt(enc_rs, data.signerPrivKey),
    );

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
    const enc_rs = RingSignature.partialSign(
      data.publicKeys_ed25519,
      data.message,
      data.signerPubKey_ed25519,
      ed25519,
      data.signerEncryptionPubKey,
    );

    const rs = RingSignature.base64ToPartialSig(
      decrypt(enc_rs, data.signerPrivKey),
    );

    // check properties
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

  it("Should throw an error if the input is not a valid base64 encoded string", () => {
    expect(() =>
      RingSignature.base64ToPartialSig("not a valid base64 string"),
    ).toThrow(invalidBase64());
  });
});
