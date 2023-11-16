"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const errors_1 = require("../../src/errors");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
/*
 * Test for piSignature function
 *
 * test if:
 * - piSignature() throw if alpha = 0
 * - piSignature() throw if c = 0
 * - piSignature() throw if signerPrivKey = 0
 */
describe("test piSignature()", () => {
    it("Should return a valid signature", () => {
        expect(() => (0, src_1.piSignature)(BigInt(123456789), BigInt(123456789), BigInt(123456789), secp256k1)).not.toThrow();
    });
    it("Should throw if alpha = 0", () => {
        expect(() => (0, src_1.piSignature)(BigInt(0), BigInt(123456789), BigInt(123456789), secp256k1)).toThrow((0, errors_1.invalidParams)());
    });
    it("Should throw if c = 0", () => {
        expect(() => (0, src_1.piSignature)(BigInt(123456789), BigInt(0), BigInt(123456789), secp256k1)).toThrow((0, errors_1.invalidParams)());
    });
    it("Should throw if signerPrivKey = 0", () => {
        expect(() => (0, src_1.piSignature)(BigInt(123456789), BigInt(123456789), BigInt(0), secp256k1)).toThrow((0, errors_1.invalidParams)());
    });
});
