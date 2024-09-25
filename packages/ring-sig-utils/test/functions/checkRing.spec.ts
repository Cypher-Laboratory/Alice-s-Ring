import { Curve, CurveName } from "../../src";
import { invalidPoint, noEmptyRing } from "../../src/errors";
import { checkRing } from "../../src";
import * as data from "../data";

const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

/*
 * Test for checkRing function
 *
 * test if:
 * - returns void if the ring is valid
 * - throws an error if the ring is empty
 * - throws an error if at least one point is not on the specified curve
 * - throws an error if the ring contains duplicates
 * - throws an error if the ring contains invalid points
 */
describe("test checkRing()", () => {
  it("Should return void if the ring is valid", () => {
    expect(() => checkRing(data.publicKeys_secp256k1, secp256k1)).not.toThrow();
  });

  it("Should throw an error if the ring is empty", () => {
    expect(() => checkRing([], secp256k1)).toThrow(noEmptyRing);
  });

  it("Should throw an error if at least one point is not on the specified curve", () => {
    expect(() => checkRing(data.publicKeys_secp256k1, ed25519)).toThrow(
      invalidPoint("At least one point is not valid: Error: Curve mismatch"),
    );
  });

  it("Should throw an error if the ring contains duplicates", () => {
    expect(() =>
      checkRing(
        data.publicKeys_secp256k1.concat(data.publicKeys_secp256k1),
        secp256k1,
      ),
    ).toThrow("Duplicates found in ring");
  });

  it("Should throw an error if the ring contains invalid points", () => {
    const invalid = secp256k1.GtoPoint();
    invalid.x = BigInt(0);
    expect(() =>
      checkRing(data.publicKeys_secp256k1.concat([invalid]), secp256k1),
    ).toThrow(
      "Invalid point: At least one point is not valid: Error: Invalid point: not on curve",
    );
  });
});
