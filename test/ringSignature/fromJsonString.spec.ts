import { RingSignature } from "../../src";
import { invalidJson } from "../../src/errors";
import * as jsonRS from "../data/jsonSignatures.json";

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
 * - the method throws an error if config.safeMode is not a boolean
 * - the method throws an error if config.evmCompatibility is not a boolean
 * - the method throws an error if config.hash is not in the list of supported hash functions
 */
describe("Test fromJsonString()", () => {
  it("Should return a RingSignature object", () => {
    expect(RingSignature.fromJsonString(jsonRS.valid)).toBeInstanceOf(
      RingSignature,
    );
  });

  it("Should throw an error if the input is not a valid json", () => {
    expect(() => {
      RingSignature.fromJsonString(JSON.stringify(jsonRS.valid).slice(0, 1));
    }).toThrow(); // no error message because it depends on the node version used
  });

  // TODO: here we test an invalid coordinates
  // test with invalid param types
  it("Should throw if a point is not valid", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.invalidPoint);
    }).toThrow(
      invalidJson(
        "Error: Invalid param: Point is not on curve: 0,20165396248642806335661137158563863822683438728408180285542980607824890485122",
      ),
    );
  });

  it("Should throw if the curve is not valid (invalid G)", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.invalidCurve);
    }).toThrow(
      invalidJson("Error: Invalid param: Generator point is not on curve"),
    );
  });

  it("Should throw if the message is empty", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.emptyMessage);
    }).toThrow(invalidJson("Error: Cannot sign empty message"));
  });

  it("Should throw if the message is not a string or a number", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.msgNotString);
    }).toThrow(invalidJson("Message must be a string or a number"));
  });

  it("Should throw if the c is 0 ", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.cEquals0);
    }).toThrow(invalidJson("Error: Invalid param: c"));
  });

  it("Should throw if c is not a string or a number ", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.cIsArray);
    }).toThrow(invalidJson("c must be a string or a number"));
  });

  it("Should throw if the randomResponses is not valid", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.invalidRandomResponses);
    }).toThrow(invalidJson("TypeError: sig.responses.map is not a function"));
  });

  it("Should throw if at least one argument is undefined", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.undefinedResponses);
    }).toThrow(
      invalidJson(
        "TypeError: Cannot read properties of undefined (reading 'map')",
      ),
    );
  });

  it("Should throw if at least one argument is null", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.nullMessage);
    }).toThrow(invalidJson("Message must be a string or a number"));
  });

  it("Should throw if the config is not an object", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.configNotObject);
    }).toThrow(invalidJson("Config must be an object"));
  });

  it("Should throw if config.safeMode is not a boolean", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.configSafeModeNotBoolean);
    }).toThrow(invalidJson("Config.safeMode must be a boolean"));
  });

  it("Should throw if config.evmCompatibility is not a boolean", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.configEvmCompatibilityNotBoolean);
    }).toThrow(invalidJson("Config.evmCompatibility must be a boolean"));
  });

  it("Should throw if config.hash is not in the list of supported hash functions", () => {
    expect(() => {
      RingSignature.fromJsonString(jsonRS.configHashNotSupported);
    }).toThrow(invalidJson("Config.hash must be an element from hashFunction"));
  });
});
