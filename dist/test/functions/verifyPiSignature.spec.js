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
const utils_1 = require("../../src/utils");
const data = __importStar(require("../data"));
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const message = BigInt("0x" + (0, utils_1.hash)(data.message));
const c = BigInt(1234567890);
const sig = (0, src_1.piSignature)(c, message, data.signerPrivKey, secp256k1);
/*
 * Test for verifyPiSignature function
 *
 * test if:
 * - piSignature() throw if alpha = 0
 * - piSignature() throw if c = 0
 * - piSignature() throw if signerPrivKey is not on curve
 */
describe("test verifyPiSignature()", () => {
    it("Should return true for a valid signature", () => {
        expect((0, src_1.verifyPiSignature)(message, data.signerPubKey_secp256k1, c, sig, secp256k1)).toBe(true);
    });
    it("Should throw if alpha is 0", () => {
        expect(() => (0, src_1.verifyPiSignature)(0n, data.signerPubKey_secp256k1, c, sig, secp256k1)).toThrow((0, errors_1.invalidParams)());
    });
    it("Should throw if c = 0", () => {
        expect(() => (0, src_1.verifyPiSignature)(message, data.signerPubKey_secp256k1, BigInt(0), sig, secp256k1)).toThrow((0, errors_1.invalidParams)());
    });
    it("Should throw if piSignature = 0", () => {
        expect(() => (0, src_1.verifyPiSignature)(message, data.signerPubKey_secp256k1, c, 0n, secp256k1)).toThrow((0, errors_1.invalidParams)());
    });
    it("Should throw if the signer public key is not on curve", () => {
        const invalidPubKey = data.signerPubKey_secp256k1;
        invalidPubKey.x = BigInt(10);
        expect(() => (0, src_1.verifyPiSignature)(message, invalidPubKey, c, sig, secp256k1)).toThrow();
    });
});
