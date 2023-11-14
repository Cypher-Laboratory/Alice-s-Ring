"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const errors_1 = require("../../src/errors");
const ringSignature_1 = require("../../src/ringSignature");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/*
 * Test for checkPoint function
 *
 * test if:
 * - checkPoint() returns void if the point is valid
 * - checkPoint() throws if the point is not on the curve
 * - checkPoint() throws if the point's curve is not the specified curve
 */
describe("test checkPoint()", () => {
    it("Should return true if the point is valid", () => {
        const point = secp256k1.GtoPoint();
        expect(() => (0, ringSignature_1.checkPoint)(point)).not.toThrow();
    });
    it("Should throw if the point is not on the curve", () => {
        const point = secp256k1.GtoPoint();
        point.x = BigInt(123456789);
        expect(() => (0, ringSignature_1.checkPoint)(point)).toThrow((0, errors_1.notOnCurve)());
    });
    it("Should throw if the point's curve is not the specified curve", () => {
        const point = secp256k1.GtoPoint();
        expect(() => (0, ringSignature_1.checkPoint)(point, ed25519)).toThrow((0, errors_1.curveMismatch)());
    });
});
