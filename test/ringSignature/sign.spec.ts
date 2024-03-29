import { Curve, CurveName, RingSignature } from "../../src";
import * as data from "../data";
import { invalidParams, invalidRing } from "../../src/errors";
import { hashFunction } from "../../src/utils/hashFunction";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/**
 * Test the RingSignature.sign() method
 *
 * test if:
 * - the method returns a valid RingSignature object
 * - the method throws if the ring is not valid
 * - the method returns a valid signature if the ring is empty
 * - the method throws if signerPrivKey is not valid
 * - the method throws if the message is empty
 * - the method returns a valid ring signature if config.hash is SHA512
 */
describe("Test sign()", () => {
  /* ------------RINGSIZE > 0------------ */
  it("Should return a valid ring signature - secp256k1", () => {
    const ringSignature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
    );
    expect(ringSignature).toBeInstanceOf(RingSignature);
    expect(ringSignature.verify()).toBe(true);
  });

  it("Should return a valid ring signature - ed25519", () => {
    const ringSignature = RingSignature.sign(
      data.publicKeys_ed25519,
      data.signerPrivKey,
      data.message,
      ed25519,
    );
    expect(ringSignature).toBeInstanceOf(RingSignature);
    expect(ringSignature.verify()).toBe(true);
  });

  it("Should throw if the ring is not valid - secp256k1", () => {
    expect(() => {
      RingSignature.sign(
        data.publicKeys_secp256k1.slice(1).concat(data.idPointX_secp256k1),
        data.signerPrivKey,
        data.message,
        secp256k1,
      );
    }).toThrow(
      "Invalid point: At least one point is not valid: Error: Invalid point: not on curve",
    );
  });

  it("Should throw if the ring is not valid - ed25519", () => {
    expect(() => {
      RingSignature.sign(
        data.publicKeys_ed25519.slice(1).concat(data.idPointX_ed25519),
        data.signerPrivKey,
        data.message,
        ed25519,
      );
    }).toThrow(
      invalidRing(
        "The ring is not sorted",
      ),
    );
  });

  it("Should return a valid signature if the ring is empty - secp256k1", () => {
    const ringSignature = RingSignature.sign(
      [],
      data.signerPrivKey,
      data.message,
      secp256k1,
    );

    expect(ringSignature).toBeInstanceOf(RingSignature);
    // test if the ring signature is valid
    expect(ringSignature.verify()).toBeTruthy();
  });

  it("Should return a valid signature if the ring is empty - ed25519", () => {
    const ringSignature = RingSignature.sign(
      [],
      data.signerPrivKey,
      data.message,
      ed25519,
    );

    expect(ringSignature).toBeInstanceOf(RingSignature);
    // test if the ring signature is valid
    expect(ringSignature.verify()).toBeTruthy();
  });

  it("Should throw if signerPrivKey is not valid - secp256k1", () => {
    expect(() => {
      RingSignature.sign(
        data.publicKeys_secp256k1,
        0n,
        data.message,
        secp256k1,
      );
    }).toThrow(invalidParams("Signer private key cannot be 0 and must be < N"));
  });

  it("Should throw if signerPrivKey is not valid - ed25519", () => {
    expect(() => {
      RingSignature.sign(data.publicKeys_ed25519, 0n, data.message, ed25519);
    }).toThrow(invalidParams("Signer private key cannot be 0 and must be < N"));
  });

  /* ------------CONFIG.HASH = SHA512------------ */
  it("Should return a valid ring signature if config.hash is SHA512 - secp256k1", () => {
    const ringSignature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
      { hash: hashFunction.SHA512 },
    );
    expect(ringSignature).toBeInstanceOf(RingSignature);
    expect(ringSignature.verify()).toBe(true);
  });

  it("Should return a valid ring signature if config.hash is SHA512 - ed25519", () => {
    const ringSignature = RingSignature.sign(
      data.publicKeys_ed25519,
      data.signerPrivKey,
      data.message,
      ed25519,
      { hash: hashFunction.SHA512 },
    );
    expect(ringSignature).toBeInstanceOf(RingSignature);
    expect(ringSignature.verify()).toBe(true);
  });
});
