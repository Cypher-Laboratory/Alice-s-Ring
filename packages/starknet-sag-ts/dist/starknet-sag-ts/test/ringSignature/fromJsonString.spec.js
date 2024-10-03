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
const ring_sig_utils_1 = require("@cypher-laboratory/ring-sig-utils");
const data = __importStar(require("../data"));
/**
 * Test the RingSignature.fromJson() method
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
 */
describe("Test fromJson()", () => {
    it("Should return a RingSignature object", () => {
        const signature = src_1.RingSignature.fromJson(data.jsonRS.valid);
        expect(signature).toBeInstanceOf(src_1.RingSignature);
        expect(signature.verify()).toBe(true);
    });
    it("Should throw an error if the input is not a valid json", () => {
        expect(() => {
            src_1.RingSignature.fromJson(JSON.stringify(data.jsonRS.valid).slice(0, 1));
        }).toThrow(); // no error message because it depends on the node version used
    });
    // test with invalid param types
    it("Should throw if a point is not valid", () => {
        expect(() => {
            src_1.RingSignature.fromJson(data.jsonRS.invalidPoint);
        }).toThrow("Point is not on curve: [10346397184098159818256440585121857622196485392949286607356908257589657045119, 59740408343500434874037892492299096053039967015620848237175731335480776099981]");
    });
    it("Should throw if the curve is not valid (invalid G)", () => {
        expect(() => {
            src_1.RingSignature.fromJson(data.jsonRS.invalidCurve);
        }).toThrow("Unknown curve: invalid curve");
    });
    it("Should throw if the message is not a string", () => {
        expect(() => {
            src_1.RingSignature.fromJson(data.jsonRS.msgNotString);
        }).toThrow(ring_sig_utils_1.errors.invalidJson("Message must be a string "));
    });
    it("Should throw if c is not a string or a number ", () => {
        expect(() => {
            src_1.RingSignature.fromJson(data.jsonRS.cIsArray);
        }).toThrow(ring_sig_utils_1.errors.invalidJson("c must be a string or a number"));
    });
    it("Should throw if the randomResponses is not valid", () => {
        expect(() => {
            src_1.RingSignature.fromJson(data.jsonRS.invalidRandomResponses);
        }).toThrow();
    });
    it("Should throw if at least one argument is undefined", () => {
        expect(() => {
            src_1.RingSignature.fromJson(data.jsonRS.undefinedResponses);
        }).toThrow("Cannot read properties of undefined (reading 'map')");
    });
    it("Should throw if at least one argument is null", () => {
        expect(() => {
            src_1.RingSignature.fromJson(data.jsonRS.nullMessage);
        }).toThrow(ring_sig_utils_1.errors.invalidJson("Message must be a string "));
    });
});
