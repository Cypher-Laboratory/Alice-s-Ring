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
const data = __importStar(require("../data"));
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/**
 * Test the RingSignature.partialSigToBase64() method
 *
 * test if:
 * - the method returns a valid base64 encoded string
 * - the method's output can be used to create a valid PartialSignature
 */
describe("Test partialSigToBase64()", () => {
    it("Should return a valid base64 encoded string", () => {
        const ps = src_1.RingSignature.partialSign(data.publicKeys_secp256k1, data.message, data.signerPubKey_secp256k1, secp256k1);
        expect(() => src_1.RingSignature.partialSigToBase64(ps)).not.toThrow();
        expect(typeof src_1.RingSignature.partialSigToBase64(ps)).toBe("string");
        expect(data.base64Regex.test(src_1.RingSignature.partialSigToBase64(ps))).toBe(true);
    });
    it("Should return a valid PartialSignature object - secp256k1", () => {
        const ps = src_1.RingSignature.partialSigToBase64(src_1.RingSignature.partialSign(data.publicKeys_secp256k1, data.message, data.signerPubKey_secp256k1, secp256k1));
        const rs = src_1.RingSignature.base64ToPartialSig(ps);
        expect(rs).toBeDefined();
        expect(rs.ring).toBeDefined();
        expect(rs.ring.length).toBe(data.publicKeys_secp256k1.length + 1); // +1 for the signerPubKey
        expect(rs.pi).toBeDefined();
        expect(rs.c).toBeDefined();
        expect(rs.cpi).toBeDefined();
        expect(rs.alpha).toBeDefined();
        expect(rs.responses).toBeDefined();
        expect(rs.curve).toBeDefined();
        expect(rs.curve.name).toBe(src_1.CurveName.SECP256K1);
        expect(rs.config).not.toBeDefined();
    });
    it("Should return a valid PartialSignature object - ed25519", () => {
        const ps = src_1.RingSignature.partialSigToBase64(src_1.RingSignature.partialSign(data.publicKeys_ed25519, data.message, data.signerPubKey_ed25519, ed25519));
        const rs = src_1.RingSignature.base64ToPartialSig(ps);
        expect(rs).toBeDefined();
        expect(rs.ring).toBeDefined();
        expect(rs.ring.length).toBe(data.publicKeys_ed25519.length + 1); // +1 for the signerPubKey
        expect(rs.pi).toBeDefined();
        expect(rs.c).toBeDefined();
        expect(rs.cpi).toBeDefined();
        expect(rs.alpha).toBeDefined();
        expect(rs.responses).toBeDefined();
        expect(rs.curve).toBeDefined();
        expect(rs.curve.name).toBe(src_1.CurveName.ED25519);
        expect(rs.config).not.toBeDefined();
    });
});
