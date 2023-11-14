"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/**
 * Test the Curve.equals() method
 *
 * test if:
 * - the method returns true if the curves are the same
 * - the method returns false if the curves are different
 */
describe("Test equals()", () => {
    it("Should return true if the curves are the same - secp256k1", () => {
        expect(secp256k1.equals(secp256k1)).toBe(true);
    });
    it("Should return true if the curves are the same - ed25519", () => {
        expect(ed25519.equals(ed25519)).toBe(true);
    });
    it("Should return false if the curves are different - secp256k1", () => {
        expect(secp256k1.equals(ed25519)).toBe(false);
    });
    it("Should return false if the curves are different - ed25519", () => {
        expect(ed25519.equals(secp256k1)).toBe(false);
    });
});
