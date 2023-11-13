import { Curve, CurveName, RingSignature } from "../../src";
import { invalidBase64 } from "../../src/errors";
import { hash } from "../../src/utils";
import { hashFunction } from "../../src/utils/hashFunction";
import * as data from "../data";
import * as partialSigSample from "./partialSigSample";

const secp256k1 = new Curve(CurveName.SECP256K1);

/**
 * Test the RingSignature.base64ToPartialSig() method
 *
 * test if:
 * - the method returns a valid partialSig object from a valid base64 encoded string
 * - the method throws an error if the input is not a valid base64 encoded string
 */
describe("Test base64ToPartialSig()", () => {
  it("Should return a PartialSig object", () => {
    const partialSig = RingSignature.base64ToPartialSig(
      data.jsonRS.validBase64PartialSig,
    );
    expect(partialSig).toBeInstanceOf(Object);
    expect(partialSig).toHaveProperty("alpha");
    expect(partialSig).toHaveProperty("cpi");
    expect(partialSig).toHaveProperty("ring");
    expect(partialSig).toHaveProperty("message");
    expect(partialSig).toHaveProperty("curve");
    expect(partialSig).toHaveProperty("config");
  });
  it("Should throw an error if the input is not a valid base64String", () => {
    expect(() => {
      RingSignature.base64ToPartialSig(
        JSON.stringify(data.jsonRS.invalidBase64Str),
      );
    }).toThrow(invalidBase64());
  });

  it("Should return a valid PartialSig object", () => {
});
