import { Curve, CurveName, RingSignature } from "../../src";
import * as data from "../data";
import { invalidParams, invalidRing } from "../../src/errors";
import { verifyPiSignature } from "../../src/signature/piSignature";
import { hashFunction } from "../../src/utils/hashFunction";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/**
 * Test the RingSignature.fromJsonString() method
 *
 * test if:
 * - the method returns a valid RingSignature object
 * - the method throws if the ring is not valid
 * - the method returns a valid Schnorr signature if the ring is empty
 * - the method throws if signerPrivKey is not valid
 * - the method throws if the message is empty
 * - the method returns a valid ring signature if config.evmCompatibility is true
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
      invalidRing(
        // eslint-disable-next-line max-len
        'Error: Invalid point: At least one point is not valid: Error: Invalid param: Point is not on curve: {"curve":"{\\"curve\\":\\"SECP256K1\\",\\"Gx\\":\\"55066263022277343669578718895168534326250603453777594175500187360389116729240\\",\\"Gy\\":\\"32670510020758816978083085130507043184471273380659243275938904335757337482424\\",\\"N\\":\\"115792089237316195423570985008687907852837564279074904382605163141518161494337\\",\\"P\\":\\"115792089237316195423570985008687907853269984665640564039457584007908834671663\\"}","x":"0","y":"1"}',
      ),
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
        // eslint-disable-next-line max-len
        'Error: Invalid point: At least one point is not valid: Error: Invalid param: Point is not on curve: {"curve":"{\\"curve\\":\\"ED25519\\",\\"Gx\\":\\"15112221349535400772501151409588531511454012693041857206046113283949847762202\\",\\"Gy\\":\\"46316835694926478169428394003475163141307993866256225615783033603165251855960\\",\\"N\\":\\"7237005577332262213973186563042994240857116359379907606001950938285454250989\\",\\"P\\":\\"57896044618658097711785492504343953926634992332820282019728792003956564819949\\"}","x":"0","y":"1"}',
      ),
    );
  });

  it("Should return a valid Schnorr signature if the ring is empty - secp256k1", () => {
    const ringSignature = RingSignature.sign(
      [],
      data.signerPrivKey,
      data.message,
      secp256k1,
    );

    expect(ringSignature).toBeInstanceOf(RingSignature);
    // test if the ring signature is valid
    expect(ringSignature.verify()).toBe(true);
    // test if the ring signature is a Schnorr signature
    expect(
      verifyPiSignature(
        data.message,
        ringSignature.ring[0],
        ringSignature.c,
        ringSignature.responses[0],
        ringSignature.curve,
        ringSignature.config,
      ),
    ).toBe(true);
  });

  it("Should return a valid Schnorr signature if the ring is empty - ed25519", () => {
    const ringSignature = RingSignature.sign(
      [],
      data.signerPrivKey,
      data.message,
      ed25519,
    );

    expect(ringSignature).toBeInstanceOf(RingSignature);
    // test if the ring signature is valid
    //expect(ringSignature.verify()).toBe(true);
    // test if the ring signature is a Schnorr signature
    expect(
      verifyPiSignature(
        ringSignature.message,
        ringSignature.ring[0],
        ringSignature.c,
        ringSignature.responses[0],
        ringSignature.curve,
        ringSignature.config,
      ),
    ).toBe(true);
  });

  it("Should throw if signerPrivKey is not valid - secp256k1", () => {
    expect(() => {
      RingSignature.sign(
        data.publicKeys_secp256k1,
        0n,
        data.message,
        secp256k1,
      );
    }).toThrow(invalidParams("Signer private key cannot be 0"));
  });

  it("Should throw if signerPrivKey is not valid - ed25519", () => {
    expect(() => {
      RingSignature.sign(data.publicKeys_ed25519, 0n, data.message, ed25519);
    }).toThrow(invalidParams("Signer private key cannot be 0"));
  });

  it("Should throw if the message is empty - secp256k1", () => {
    expect(() => {
      RingSignature.sign(
        data.publicKeys_secp256k1,
        data.signerPrivKey,
        data.emptyMessage,
        secp256k1,
      );
    }).toThrow("Cannot sign empty message");
  });

  it("Should throw if the message is empty - ed25519", () => {
    expect(() => {
      RingSignature.sign(
        data.publicKeys_ed25519,
        data.signerPrivKey,
        data.emptyMessage,
        ed25519,
      );
    }).toThrow("Cannot sign empty message");
  });

  /* ------------CONFIG.EVMCOMPATIBILITY = TRUE------------ */
  it("Should return a valid ring signature if config.evmCompatibility is true - secp256k1", () => {
    const ringSignature = RingSignature.sign(
      data.publicKeys_secp256k1,
      data.signerPrivKey,
      data.message,
      secp256k1,
      { evmCompatibility: true },
    );
    expect(ringSignature).toBeInstanceOf(RingSignature);
    expect(ringSignature.verify()).toBe(true);
  });

  it("Should return a valid ring signature if config.evmCompatibility is true - ed25519", () => {
    const ringSignature = RingSignature.sign(
      data.publicKeys_ed25519,
      data.signerPrivKey,
      data.message,
      ed25519,
      { evmCompatibility: true },
    );
    expect(ringSignature).toBeInstanceOf(RingSignature);
    expect(ringSignature.verify()).toBe(true);
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
