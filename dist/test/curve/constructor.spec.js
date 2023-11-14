"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const errors_1 = require("../../src/errors");
/**
 * Test constructor
 *
 * test if:
 * - the method pass with valid parameters
 * - the method throws with invalid parameters
 */
describe("Test Curve constructor", () => {
    it("Should pass using valid values", () => {
        expect(() => {
            new src_1.Curve(src_1.CurveName.ED25519);
        }).not.toThrow();
        expect(() => {
            new src_1.Curve(src_1.CurveName.SECP256K1);
        }).not.toThrow();
    });
    it("Should throw using invalid name", () => {
        expect(() => {
            new src_1.Curve("invalid name");
        }).toThrow((0, errors_1.unknownCurve)("invalid name"));
    });
});
