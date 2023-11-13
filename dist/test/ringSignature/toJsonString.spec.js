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
const points = __importStar(require("../data/points"));
const message = __importStar(require("../data/message"));
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
/**
 * Test the RingSignature.toJsonString() method
 *
 * test if:
 * - the method returns a valid json string
 * - the method's output can be used to create a valid RingSignature
 */
describe("Test toJsonString()", () => {
    it("Should return a valid json string", () => {
        const rs = new src_1.RingSignature(message.message, points.publicKeys_secp256k1, points.randomC, points.randomResponses, secp256k1);
        expect(() => JSON.parse(rs.toJsonString())).not.toThrow();
    });
    it("Should return a valid RingSignature", () => {
        const rs = new src_1.RingSignature(message.message, points.publicKeys_secp256k1, points.randomC, points.randomResponses, secp256k1);
        expect(src_1.RingSignature.fromJsonString(rs.toJsonString())).toBeInstanceOf(src_1.RingSignature);
    });
});
