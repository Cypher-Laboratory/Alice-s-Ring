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
 * Test the RingSignature.fromBase64() method
 *
 * test if:
 * - the method returns a RingSignature object from a valid base64 encoded string
 * - the method throws an error if the input is not a valid base64 encoded string
 *
 * @remarks
 * the following tests are performed by RingSignature.fromJson() (caller once the base64 string is decoded):
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
describe("Test fromBase64()", () => {
    it("Should return a RingSignature object", () => {
        expect(src_1.RingSignature.fromBase64(data.jsonRS.validBase64Sig)).toBeInstanceOf(src_1.RingSignature);
    });
    it("Should throw an error if the input is not a valid base64String", () => {
        expect(() => {
            src_1.RingSignature.fromBase64(JSON.stringify(data.jsonRS.invalidBase64Str));
        }).toThrow(ring_sig_utils_1.errors.invalidBase64());
    });
});
