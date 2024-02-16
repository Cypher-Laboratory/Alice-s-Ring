import { RingSignature } from "../../src";
import { invalidBase64 } from "../../src/errors";
import * as data from "../data";

/**
 * Test the RingSignature.fromBase64() method
 *
 * test if:
 * - the method returns a RingSignature object from a valid base64 encoded string
 * - the method throws an error if the input is not a valid base64 encoded string
 *
 * @remarks
 * the following tests are performed by RingSignature.fromJsonString() (caller once the base64 string is decoded):
 * - the method throws an error if a point is not valid
 * - the method throws an error if the curve is not valid
 * - the method throws an error if the message is not valid
 * - the method throws an error if the c is not valid
 * - the method throws an error if the randomResponses is not valid
 * - the method throws an error if at least one argument is undefined
 * - the method throws an error if at least one argument is null
 * - the method throws an error if the config is not an object
 * - the method throws an error if config.safeMode is not a boolean
 * - the method throws an error if config.hash is not in the list of supported hash functions
 */
describe("Test fromBase64()", () => {
  it("Should return a RingSignature object", () => {
    expect(RingSignature.fromBase64(data.jsonRS.validBase64Sig)).toBeInstanceOf(
      RingSignature,
    );
  });

  it("Should throw an error if the input is not a valid base64String", () => {
    expect(() => {
      RingSignature.fromBase64(JSON.stringify(data.jsonRS.invalidBase64Str));
    }).toThrow(invalidBase64());
  });
});
