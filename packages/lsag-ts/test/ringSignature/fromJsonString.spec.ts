import { RingSignature } from "../../src";
import { errors } from "@cypher-laboratory/ring-sig-utils";
import * as data from "../data";

/**
 * Test the RingSignature.fromJsonString() method
 *
 * test if:
 * - the method returns a RingSignature object from a valid json
 * - the method throws an error if the input is not a valid json
 * - the method throws an error if a point is not valid
 * - the method throws an error if the curve is not valid
 * - the method throws an error if the message is not valid
 * - the method throws an error if the c is not valid
 * - the method throws an error if the randomResponses is not valid
 * - the method throws an error if at least one argument is undefined
 * - the method throws an error if at least one argument is null
 * - the method throws an error if the config is not an object
 * - the method throws an error if config.hash is not in the list of supported hash functions
 */
describe("Test fromJsonString()", () => {
  it("Should return a RingSignature object", () => {
    const signature = RingSignature.fromJsonString(data.jsonRS.valid)
    expect(signature).toBeInstanceOf(
      RingSignature,
    );

    expect(signature).toBe(true);
  });

  // it("Should throw an error if the input is not a valid json", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(
  //       JSON.stringify(data.jsonRS.valid).slice(0, 1),
  //     );
  //   }).toThrow(); // no error message because it depends on the node version used
  // });

  // // test with invalid param types
  // it("Should throw if a point is not valid", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.invalidPoint);
  //   }).toThrow(
  //     // eslint-disable-next-line max-len
  //     "Invalid JSON: Error: Point is not on curve: [7669796787251805891978232874303712093234845412173053607237401859712735670475, 56825597203825128713048197463561454601110236268660445092720184871340189052152]",
  //   );
  // });

  // it("Should throw if the curve is not valid (invalid G)", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.invalidCurve);
  //   }).toThrow("Invalid JSON: Error: Unknown curve: idk");
  // });

  // it("Should throw if the message is not a string", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.msgNotString);
  //   }).toThrow(errors.invalidJson("Message must be a string "));
  // });

  // it("Should throw if the randomResponses is not valid", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.invalidRandomResponses);
  //   }).toThrow("sig.responses.map is not a function");
  // });

  // it("Should throw if at least one argument is undefined", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.undefinedResponses);
  //   }).toThrow("Cannot read properties of undefined (reading 'map')");
  // });

  // it("Should throw if at least one argument is null", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.nullMessage);
  //   }).toThrow(errors.invalidJson("Message must be a string "));
  // });

  // it("Should throw if the config is not an object", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.configNotObject);
  //   }).toThrow(errors.invalidJson("Config must be an object"));
  // });

  // it("Should throw if config.hash is not in the list of supported hash functions", () => {
  //   expect(() => {
  //     RingSignature.fromJsonString(data.jsonRS.configHashNotSupported);
  //   }).toThrow(
  //     errors.invalidJson("Config.hash must be an element from HashFunction"),
  //   );
  // });
});
