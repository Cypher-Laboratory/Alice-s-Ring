"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/**
 * Test the Curve.GToPoint() method
 *
 * test if:
 * - the method returns a point on the curve
 */
describe("Test GtoPoint()", () => {
    it("Should return a point on the same curve - secp256k1", () => {
        const G = secp256k1.GtoPoint();
        expect(G).toBeInstanceOf(src_1.Point);
        expect(G.curve).toBe(secp256k1);
    });
    it("Should return a point on the same curve - ed25519", () => {
        const G = ed25519.GtoPoint();
        expect(G).toBeInstanceOf(src_1.Point);
        expect(G.curve).toBe(ed25519);
    });
});
