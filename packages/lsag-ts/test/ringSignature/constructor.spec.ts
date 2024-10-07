import { RingSignature } from "../../src";
import {
  ecHash,
  errors,
  Curve,
  CurveName,
  Point,
} from "@cypher-laboratory/ring-sig-utils";
import * as data from "../data";

// const ed25519 = new Curve(CurveName.ED25519);
const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);
describe("Test Constructor", () => {
  /**
   * Test constructor with invalid parameters:
   * - msg is empty
   * - ring is empty
   * - ring contains at least 1 point that is not on the curve
   * - ring contains at least 1 point that is (0, 0)
   * - ring and responses length do not match
   * - at least 1 response is 0
   * - c is 0
   */
  describe("Test constructor with invalid parameters", () => {
    it("Should throw if public keys are empty - secp256k1", () => {
      const customMapped = ecHash(
        [data.signerPubKey_secp256k1.serialize()].concat(
          data.linkabilityFlag ? [data.linkabilityFlag] : [],
        ),
        secp256k1,
      );

      const keyImage = customMapped.mult(data.signerPrivKey);

      expect(
        () =>
          new RingSignature(
            data.message,
            [],
            data.randomC,
            data.randomResponses,
            secp256k1,
            keyImage,
            data.linkabilityFlag,
          ),
      ).toThrow(errors.noEmptyRing);
    });
  });
  it("Should throw if public keys are empty - ed25519", () => {
    const customMapped = ecHash(
      [data.signerPubKey_ed25519.serialize()].concat(
        data.linkabilityFlag ? [data.linkabilityFlag] : [],
      ),
      ed25519,
    );
    const keyImage = customMapped.mult(data.signerPrivKey);

    expect(
      () =>
        new RingSignature(
          data.message,
          [],
          data.randomC,
          data.randomResponses,
          ed25519,
          keyImage,
          data.linkabilityFlag,
        ),
    ).toThrow(errors.noEmptyRing);
  });
});

it("Should throw if at least 1 public key is not on the curve - secp256k1", () => {
  const ring = data.publicKeys_secp256k1.slice(1);
  const customMapped = ecHash(
    [data.signerPubKey_secp256k1.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    secp256k1,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);
  expect(
    () =>
      new RingSignature(
        data.message,
        [new Point(secp256k1, [2n, 3n])].concat(ring),
        data.randomC,
        data.randomResponses,
        secp256k1,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow(errors.notOnCurve(`[2, 3]`));
});

it("Should throw if at least 1 public key is not on the curve - ed25519", () => {
  const ring = data.publicKeys_ed25519.slice(1);
  const customMapped = ecHash(
    [data.signerPubKey_ed25519.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    ed25519,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);
  expect(
    () =>
      new RingSignature(
        data.message,
        [new Point(ed25519, [2n, 3n])].concat(ring),
        data.randomC,
        data.randomResponses,
        ed25519,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow(errors.notOnCurve(`[2, 3]`));
});

it("Should throw if one point is (0, 0) - secp256k1", () => {
  const ring = data.publicKeys_secp256k1.slice(1);
  const customMapped = ecHash(
    [data.signerPubKey_secp256k1.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    secp256k1,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);

  expect(
    () =>
      new RingSignature(
        data.message,
        [new Point(secp256k1, [0n, 0n])].concat(ring),
        data.randomC,
        data.randomResponses,
        secp256k1,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow("Point is not on curve: [0, 0]");
});

it("Should throw if one point is (0, 0) - ed25519", () => {
  const ring = data.publicKeys_ed25519.slice(1);
  const customMapped = ecHash(
    [data.signerPubKey_ed25519.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    ed25519,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);

  expect(
    () =>
      new RingSignature(
        data.message,
        [new Point(ed25519, [0n, 0n])].concat(ring),
        data.randomC,
        data.randomResponses,
        ed25519,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow("Point is not on curve: [0, 0]");
});

it("Should throw if ring and responses length do not match - secp256k1", () => {
  const customMapped = ecHash(
    [data.signerPubKey_secp256k1.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    secp256k1,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);
  expect(
    () =>
      new RingSignature(
        data.message,
        data.publicKeys_secp256k1,
        data.randomC,
        data.randomResponses.slice(1),
        secp256k1,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow(errors.lengthMismatch("ring", "responses"));
});

it("Should throw if ring and responses length do not match - ed25519", () => {
  const customMapped = ecHash(
    [data.signerPubKey_ed25519.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    ed25519,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);
  expect(
    () =>
      new RingSignature(
        data.message,
        data.publicKeys_secp256k1,
        data.randomC,
        data.randomResponses.slice(1),
        ed25519,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow(errors.lengthMismatch("ring", "responses"));
});

it("Should throw if at least 1 response is 0 - secp256k1", () => {
  const customMapped = ecHash(
    [data.signerPubKey_secp256k1.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    secp256k1,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);

  expect(
    () =>
      new RingSignature(
        data.message,
        data.publicKeys_secp256k1,
        data.randomC,
        [0n].concat(data.randomResponses.slice(1)),
        secp256k1,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow(errors.invalidResponses);
});

it("Should throw if at least 1 response is 0 - ed25519", () => {
  const customMapped = ecHash(
    [data.signerPubKey_ed25519.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    ed25519,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);

  expect(
    () =>
      new RingSignature(
        data.message,
        data.publicKeys_secp256k1,
        data.randomC,
        [0n].concat(data.randomResponses.slice(1)),
        ed25519,
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow(
    "Invalid point: At least one point is not valid: Error: Curve mismatch",
  );
});

/* -------------TEST UNKNOWN CURVE------------- */
it("Should throw if curve is invalid", () => {
  const customMapped = ecHash(
    [data.signerPubKey_secp256k1.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    secp256k1,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);
  expect(
    () =>
      new RingSignature(
        data.message,
        data.publicKeys_ed25519,
        data.randomC,
        data.randomResponses,
        new Curve("invalid name" as CurveName),
        keyImage,
        data.linkabilityFlag,
      ),
  ).toThrow(errors.unknownCurve("invalid name"));
});

it("Should pass if all parameters are valid - secp256k1", () => {
  const customMapped = ecHash(
    [data.signerPubKey_secp256k1.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    secp256k1,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);

  expect(
    () =>
      new RingSignature(
        data.message,
        data.publicKeys_secp256k1,
        data.randomC,
        data.randomResponses,
        secp256k1,
        keyImage,
        data.linkabilityFlag,
      ),
  );
});
it("Should pass if all parameters are valid -ed25519", () => {
  const customMapped = ecHash(
    [data.signerPubKey_ed25519.serialize()].concat(
      data.linkabilityFlag ? [data.linkabilityFlag] : [],
    ),
    ed25519,
  );

  const keyImage = customMapped.mult(data.signerPrivKey);

  expect(
    () =>
      new RingSignature(
        data.message,
        data.publicKeys_secp256k1,
        data.randomC,
        data.randomResponses,
        ed25519,
        keyImage,
        data.linkabilityFlag,
      ),
  );
});
