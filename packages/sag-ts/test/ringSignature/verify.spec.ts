import { Curve, CurveName } from "@cypher-laboratory/ring-sig-utils";
import { RingSignature } from "../../src/ringSignature";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

// todo: test with evmCompatibility = true

/**
 * Test the RingSignature.verify() method
 *
 * test if:
 * - the method returns true if the signature is valid (ringSize > 1)
 * - the method returns false if the signature is invalid (ringSize > 1)
 * - the method returns true if the signature is valid (ringSize = 1)
 * - the method returns false if the signature is invalid (ringSize = 1)
 */
describe("Test verify()", () => {
  it("Should return true if the signature is valid - secp256k1", () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    );

    expect(signature.verify()).toBe(true);
  });
  it("Should return true if the signature is valid - ed25519", () => {
    const signature = RingSignature.sign(
      data.publicKeys_ed25519,
      data.signerPrivKey,
      data.message,
      ed25519,
    );

    expect(signature.verify()).toBe(true);
  });

  it("Should return false if the signature is invalid - secp256k1", () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    ).toJsonString();

    // modify the signature message
    const editedSig = JSON.parse(signature);
    editedSig.message = "Wrong message";

    expect(RingSignature.fromJson(editedSig).verify()).toBe(false);
  });

  it("Should return false if the signature is invalid - ed25519", () => {
    const signature = RingSignature.sign(
      data.publicKeys_ed25519,
      data.signerPrivKey,
      data.message,
      ed25519,
    ).toJsonString();

    // modify the signature message
    const editedSig = JSON.parse(signature);
    editedSig.message = "Wrong message";

    expect(RingSignature.fromJson(editedSig).verify()).toBe(false);
  });

  it("Should return true if the base64 signature is valid", () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    ).toBase64();

    expect(RingSignature.verify(signature)).toBeTruthy();
  });

  it("Should return true if the JSON signature is valid", () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    ).toJsonString();

    expect(RingSignature.verify(signature)).toBeTruthy();
  });
});
