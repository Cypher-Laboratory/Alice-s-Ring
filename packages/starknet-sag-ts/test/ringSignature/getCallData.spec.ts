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
  it("Should return the callData if the signature is valid - secp256k1", async () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    );

    const callData: bigint[] = await signature.getCallData();

    expect(Array.isArray(callData)).toBe(true);

    callData.forEach((item: bigint) => {
      expect(typeof item).toBe("bigint");
    });
  });
  it("Should return true if the signature is valid - ed25519", async () => {
    const signature = RingSignature.sign(
      data.publicKeys_ed25519,
      data.signerPrivKey,
      data.message,
      ed25519,
    );

    const callData: bigint[] = await signature.getCallData();

    expect(Array.isArray(callData)).toBe(true);

    callData.forEach((item: bigint) => {
      expect(typeof item).toBe("bigint");
    });
  });

  it("Should throw if the signature is invalid - secp256k1", async () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    ).toJsonString();
    const editedSig = JSON.parse(signature);
    editedSig.message = "Wrong message";
    await expect(RingSignature.getCallData(editedSig)).rejects.toThrow(
      "Invalid ring signature",
    );
  });

  it("Should throw if the signature is invalid - ed25519", async () => {
    const signature = RingSignature.sign(
      data.publicKeys_ed25519,
      data.signerPrivKey,
      data.message,
      ed25519,
    ).toJsonString();
    const editedSig = JSON.parse(signature);
    editedSig.message = "Wrong message";
    await expect(RingSignature.getCallData(editedSig)).rejects.toThrow(
      "Invalid ring signature",
    );
  });

  it("Should return true if the base64 signature is valid", async () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    ).toBase64();
    const callData: bigint[] = await RingSignature.getCallData(signature);
    expect(Array.isArray(callData)).toBe(true);
    callData.forEach((item: bigint) => {
      expect(typeof item).toBe("bigint");
    });
  });

  it("Should return true if the JSON signature is valid", async () => {
    const signature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    ).toJsonString();
    const callData: bigint[] = await RingSignature.getCallData(signature);
    expect(Array.isArray(callData)).toBe(true);
    callData.forEach((item: bigint) => {
      expect(typeof item).toBe("bigint");
    });
  });
});
