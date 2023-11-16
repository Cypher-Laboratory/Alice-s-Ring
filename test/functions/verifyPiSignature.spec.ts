import { Curve, CurveName, piSignature, verifyPiSignature } from "../../src";
import { invalidParams, noEmptyMsg } from "../../src/errors";
import { hash } from "../../src/utils";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);

const message = data.message;
const c = BigInt(1234567890);

const sig = piSignature(
  c,
  BigInt( '0x' + hash(message)),
  data.signerPrivKey,
  secp256k1,
);

/*
 * Test for verifyPiSignature function
 *
 * test if:
 * - piSignature() throw if alpha = 0
 * - piSignature() throw if c = 0
 * - piSignature() throw if signerPrivKey = 0
 */
describe("test verifyPiSignature()", () => {
  it("Should return true for a valid signature", () => {
    expect(
      verifyPiSignature(
        data.message,
        data.signerPubKey_secp256k1,
        c,
        sig,
        secp256k1,
      )
    ).toBe(true);
  });

  it("Should throw if message is empty", () => {
    expect(
      verifyPiSignature(
        '',
        data.signerPubKey_secp256k1,
        c,
        sig,
        secp256k1,
      ),
    ).toThrow(noEmptyMsg);
  });

  it("Should throw if c = 0", () => {
    expect(
      verifyPiSignature(
        data.message,
        data.signerPubKey_secp256k1,
        BigInt(0),
        sig,
        secp256k1,
      ),
    ).toThrow(invalidParams());
  });

  it("Should throw if piSignature = 0", () => {
    expect(
      verifyPiSignature(
        data.message,
        data.signerPubKey_secp256k1,
        c,
        0n,
        secp256k1,
      )
    ).toThrow(invalidParams());
  });

  it("Should throw if the signer public key is not on curve", () => {
    const invalidPubKey = data.signerPubKey_secp256k1;
    invalidPubKey.x = BigInt(10);

    expect(
      verifyPiSignature(
        data.message,
        invalidPubKey,
        c,
        sig,
        secp256k1,
      )
    ).toThrow();
  });
});
