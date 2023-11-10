import { Curve, CurveName, Point, RingSignature } from "../../src";
import * as points from "../points";
import * as message from "../message";
import {
  invalidParams,
  invalidResponses,
  lengthMismatch,
  noEmptyMsg,
  noEmptyRing,
  notOnCurve,
} from "../../src/errors";
import { hashFunction } from "../../src/utils/hashFunction";

const ed25519 = new Curve(CurveName.ED25519);
const secp256k1 = new Curve(CurveName.SECP256K1);

describe("Test Constructor", () => {
  /**
   * Test constructor with invalid parameters:
   * - msg is empty
   * - ring is empty
   * - ring contains at least 1 point that is not on the curve
   * - ring contains at least 1 point that is (0, 0)
   * - ring and responses length do not match
   */
  describe("Test constructor with invalid parameters", () => {
    /* -------------TEST INVALID MSG------------- */
    it("Should throw if msg is empty - ed25519", () => {
      expect(
        () =>
          new RingSignature(
            "",
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
          ),
      ).toThrow(noEmptyMsg);
    });
    it("Should throw if msg is empty - secp256k1", () => {
      expect(
        () =>
          new RingSignature(
            "",
            points.publicKeys_secp256k1,
            points.randomC,
            points.randomResponses,
            secp256k1,
          ),
      ).toThrow(noEmptyMsg);
    });

    /* -------------TEST INVALID RING------------- */
    it("Should throw if public keys are empty - ed25519", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            [],
            points.randomC,
            points.randomResponses,
            ed25519,
          ),
      ).toThrow(noEmptyRing);
    });
    it("Should throw if public keys are empty - secp256k1", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            [],
            points.randomC,
            points.randomResponses,
            secp256k1,
          ),
      ).toThrow(noEmptyRing);
    });

    it("Should throw if at least 1 public key is not on the curve - ed25519", () => {
      const ring = points.publicKeys_ed25519.slice(1);

      expect(
        () =>
          new RingSignature(
            message.message,
            [new Point(ed25519, [2n, 3n])].concat(ring),
            points.randomC,
            points.randomResponses,
            ed25519,
          ),
      ).toThrow(notOnCurve(`[2, 3]`));
    });
    it("Should throw if at least 1 public key is not on the curve - secp256k1", () => {
      const ring = points.publicKeys_secp256k1.slice(1);

      expect(
        () =>
          new RingSignature(
            message.message,
            [new Point(secp256k1, [2n, 3n])].concat(ring),
            points.randomC,
            points.randomResponses,
            secp256k1,
          ),
      ).toThrow(notOnCurve(`[2, 3]`));
    });

    it("Should throw if one point is (0, 0) - ed25519", () => {
      const ring = points.publicKeys_ed25519.slice(1);

      expect(
        () =>
          new RingSignature(
            message.message,
            [new Point(ed25519, [0n, 0n])].concat(ring),
            points.randomC,
            points.randomResponses,
            ed25519,
          ),
      ).toThrow(notOnCurve(`[0, 0]`));
    });
    it("Should throw if one point is (0, 0) - secp256k1", () => {
      const ring = points.publicKeys_secp256k1.slice(1);

      expect(
        () =>
          new RingSignature(
            message.message,
            [new Point(secp256k1, [0n, 0n])].concat(ring),
            points.randomC,
            points.randomResponses,
            secp256k1,
          ),
      ).toThrow(notOnCurve(`[0, 0]`));
    });

    /* -------------TEST INVALID RING<->RESPONSES CORRELATION------------- */
    it("Should throw if ring and responses length do not match - ed25519", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses.slice(1),
            ed25519,
          ),
      ).toThrow(lengthMismatch("ring", "responses"));
    });
    it("Should throw if ring and responses length do not match - secp256k1", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_secp256k1,
            points.randomC,
            points.randomResponses.slice(1),
            secp256k1,
          ),
      ).toThrow(lengthMismatch("ring", "responses"));
    });

    /* -------------TEST INVALID RESPONSES------------- */
    it("Should throw if at least 1 response is 0 - ed25519", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses, // [0n].concat(points.randomResponses.slice(1)),
            ed25519,
          ),
      ).toThrow(invalidResponses);
    });
    it("Should throw if at least 1 response is 0 - secp256k1", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_secp256k1,
            points.randomC,
            [0n].concat(points.randomResponses.slice(1)),
            secp256k1,
          ),
      ).toThrow(invalidResponses);
    });

    /* -------------TEST INVALID C------------- */
    it("Should throw if c is 0 - ed25519", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            0n,
            points.randomResponses,
            ed25519,
          ),
      ).toThrow(invalidParams("c"));
    });

    it("Should throw if c is 0 - secp256k1", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_secp256k1,
            0n,
            points.randomResponses,
            secp256k1,
          ),
      ).toThrow(invalidParams("c"));
    });

    /* -------------TEST UNKNOWN CURVE------------- */
    it("Should throw if curve is invalid", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            new Curve(CurveName.CUSTOM),
          ),
      ).toThrow(invalidParams("Curve parameters are missing"));
    });

    /* -------------TEST CONFIG.EVMCOMPATIBILITY------------- */
    it("Should pass if config.evmCompatibility is true", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            { evmCompatibility: true },
          ),
      );
    });
    it("Should pass if config.evmCompatibility is false", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            { evmCompatibility: false },
          ),
      );
    });
    it("Should pass if config.evmCompatibility is not undefined", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            {},
          ),
      );
    });

    /* -------------TEST CONFIG.SAFEMODE------------- */
    it("Should pass if config.safeMode is true", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            { safeMode: true },
          ),
      );
    });
    it("Should pass if config.safeMode is false", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            { safeMode: false },
          ),
      );
    });
    it("Should pass if config.safeMode is not undefined", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            {},
          ),
      );
    });

    /* -------------TEST CONFIG.HASH------------- */
    it("Should pass if config.hash is keccack256", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            { hash: hashFunction.KECCAK256 },
          ),
      );
    });
    it("Should pass if config.hash is sha512", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            { hash: hashFunction.SHA512 },
          ),
      );
    });
    it("Should pass if config.hash is not undefined", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
            {},
          ),
      );
    });
  });
  describe("Test constructor with valid parameters", () => {
    it("Should pass if all parameters are valid - ed25519", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_ed25519,
            points.randomC,
            points.randomResponses,
            ed25519,
          ),
      );
    });
    it("Should pass if all parameters are valid - secp256k1", () => {
      expect(
        () =>
          new RingSignature(
            message.message,
            points.publicKeys_secp256k1,
            points.randomC,
            points.randomResponses,
            secp256k1,
          ),
      );
    });
  });
});
