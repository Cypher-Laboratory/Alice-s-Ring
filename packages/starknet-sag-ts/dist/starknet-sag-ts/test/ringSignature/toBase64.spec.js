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
const ring_sig_utils_1 = require("@cypher-laboratory/ring-sig-utils");
const ringSignature_1 = require("../../src/ringSignature");
const data = __importStar(require("../data"));
const secp256k1 = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.SECP256K1);
/**
 * Test the RingSignature.fromJson() method
 *
 * test if:
 * - the method returns a valid base64 encoded string
 * - the method's output can be used to create a valid RingSignature using fromBase64(str)
 */
describe("Test toBase64()", () => {
    it("Should return a valid base64 encoded string", () => {
        const rs = new ringSignature_1.RingSignature(data.message, data.publicKeys_secp256k1, data.randomC, data.randomResponses, secp256k1);
        expect(() => Buffer.from(rs.toBase64(), "base64")).not.toThrow();
    });
    it("Should return a valid RingSignature", () => {
        const rs = new ringSignature_1.RingSignature(data.message, data.publicKeys_secp256k1, data.randomC, data.randomResponses, secp256k1);
        expect(ringSignature_1.RingSignature.fromBase64(rs.toBase64())).toBeInstanceOf(ringSignature_1.RingSignature);
    });
});
