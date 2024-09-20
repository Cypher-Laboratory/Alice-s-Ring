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

  it("Should throw an error if the input is not a valid json", () => {
    expect(() => {
      RingSignature.fromJsonString(
        JSON.stringify(data.jsonRS.valid).slice(0, 1),
      );
    }).toThrow(); // no error message because it depends on the node version used
  });

  // test with invalid param types
  it("Should throw if a point is not valid", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.invalidPoint);
    }).toThrow(
      "Point is not on curve: [10346397184098159818256440585121857622196485392949286607356908257589657045119, 59740408343500434874037892492299096053039967015620848237175731335480776099981]",
    );
  });

  it("Should throw if the curve is not valid (invalid G)", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.invalidCurve);
    }).toThrow("Unknown curve: invalid curve");
  });

  it("Should throw if the message is not a string", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.msgNotString);
    }).toThrow(errors.invalidJson("Message must be a string "));
  });

  it("Should throw if c is not a string or a number ", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.cIsArray);
    }).toThrow(errors.invalidJson("c must be a string or a number"));
  });

  it("Should throw if the randomResponses is not valid", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.invalidRandomResponses);
    }).toThrow();
  });

  it("Should throw if at least one argument is undefined", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.undefinedResponses);
    }).toThrow("Cannot read properties of undefined (reading 'map')");
  });

  it("Should throw if at least one argument is null", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.nullMessage);
    }).toThrow(errors.invalidJson("Message must be a string "));
  });

  it("Should throw if the config is not an object", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.configNotObject);
    }).toThrow(errors.invalidJson("Config must be an object"));
  });

  it("Should throw if config.hash is not in the list of supported hash functions", () => {
    expect(() => {
      RingSignature.fromJsonString(data.jsonRS.configHashNotSupported);
    }).toThrow(
      errors.invalidJson("Config.hash must be an element from HashFunction"),
    );
  });
});
