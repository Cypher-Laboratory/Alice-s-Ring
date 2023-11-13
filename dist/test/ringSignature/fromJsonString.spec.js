"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const errors_1 = require("../../src/errors");
const data = __importStar(require("../data"));
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
        expect(src_1.RingSignature.fromJsonString(data.jsonRS.valid)).toBeInstanceOf(src_1.RingSignature);
    });
    it("Should throw an error if the input is not a valid json", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(JSON.stringify(data.jsonRS.valid).slice(0, 1));
        }).toThrow(); // no error message because it depends on the node version used
    });
    // test with invalid param types
    it("Should throw if a point is not valid", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.invalidPoint);
        }).toThrow((0, errors_1.invalidJson)("Error: Invalid param: Point is not on curve: 0,20165396248642806335661137158563863822683438728408180285542980607824890485122"));
    });
    it("Should throw if the curve is not valid (invalid G)", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.invalidCurve);
        }).toThrow((0, errors_1.invalidJson)("Error: Invalid param: Generator point is not on curve"));
    });
    it("Should throw if the message is empty", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.emptyMessage);
        }).toThrow((0, errors_1.invalidJson)("Error: Cannot sign empty message"));
    });
    it("Should throw if the message is not a string or a number", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.msgNotString);
        }).toThrow((0, errors_1.invalidJson)("Message must be a string or a number"));
    });
    it("Should throw if the c is 0 ", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.cEquals0);
        }).toThrow((0, errors_1.invalidJson)("Error: Invalid param: c"));
    });
    it("Should throw if c is not a string or a number ", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.cIsArray);
        }).toThrow((0, errors_1.invalidJson)("c must be a string or a number"));
    });
    it("Should throw if the randomResponses is not valid", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.invalidRandomResponses);
        }).toThrow((0, errors_1.invalidJson)("TypeError: sig.responses.map is not a function"));
    });
    it("Should throw if at least one argument is undefined", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.undefinedResponses);
        }).toThrow((0, errors_1.invalidJson)("TypeError: Cannot read properties of undefined (reading 'map')"));
    });
    it("Should throw if at least one argument is null", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.nullMessage);
        }).toThrow((0, errors_1.invalidJson)("Message must be a string or a number"));
    });
    it("Should throw if the config is not an object", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.configNotObject);
        }).toThrow((0, errors_1.invalidJson)("Config must be an object"));
    });
    it("Should throw if config.safeMode is not a boolean", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.configSafeModeNotBoolean);
        }).toThrow((0, errors_1.invalidJson)("Config.safeMode must be a boolean"));
    });
    it("Should throw if config.evmCompatibility is not a boolean", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.configEvmCompatibilityNotBoolean);
        }).toThrow((0, errors_1.invalidJson)("Config.evmCompatibility must be a boolean"));
    });
    it("Should throw if config.hash is not in the list of supported hash functions", () => {
        expect(() => {
            src_1.RingSignature.fromJsonString(data.jsonRS.configHashNotSupported);
        }).toThrow((0, errors_1.invalidJson)("Config.hash must be an element from hashFunction"));
    });
});
