"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/**
 * Test the Curve.toString() method
 *
 * test if:
 * - the method returns a stringified curve
 */
describe("Test toString()", () => {
    it("Should return a stringified curve - secp256k1", () => {
        expect(secp256k1.toString()).toBe(
        // eslint-disable-next-line max-len
        '{"curve":"SECP256K1"}');
    });
    it("Should return a stringified curve - ed25519", () => {
        expect(ed25519.toString()).toBe(
        // eslint-disable-next-line max-len
        '{"curve":"ED25519"}');
    });
});
