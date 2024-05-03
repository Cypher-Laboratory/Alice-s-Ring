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
 * Test the RingSignature.verify() method
 *
 * test if:
 * - the method returns true if the signature is valid (ringSize > 1)
 * - the method returns false if the signature is invalid (ringSize > 1)
 * - the method returns true if the signature is valid (ringSize = 1)
 * - the method returns false if the signature is invalid (ringSize = 1)
 */
describe("Test verify()", () => {
    it("Should return true if the signature is valid - secp256k1", () => {
        const signature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1);
        expect(signature.verify()).toBe(true);
    });
    it("Should return true if the signature is valid - ed25519", () => {
        const signature = src_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.message, ed25519);
        expect(signature.verify()).toBe(true);
    });
    it("Should return false if the signature is invalid - secp256k1", () => {
        const signature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1).toJsonString();
        // modify the signature message
        const editedSig = JSON.parse(signature);
        editedSig.message = "Wrong message";
        expect(src_1.RingSignature.fromJsonString(editedSig).verify()).toBe(false);
    });
    it("Should return false if the signature is invalid - ed25519", () => {
        const signature = src_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.message, ed25519).toJsonString();
        // modify the signature message
        const editedSig = JSON.parse(signature);
        editedSig.message = "Wrong message";
        expect(src_1.RingSignature.fromJsonString(editedSig).verify()).toBe(false);
    });
    it("Should return true if the base64 signature is valid", () => {
        const signature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1).toBase64();
        expect(src_1.RingSignature.verify(signature)).toBeTruthy();
    });
    it("Should return true if the JSON signature is valid", () => {
        const signature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1).toJsonString();
        expect(src_1.RingSignature.verify(signature)).toBeTruthy();
    });
});
