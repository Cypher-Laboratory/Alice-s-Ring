"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const errors_1 = require("../../src/errors");
const data_1 = require("../data");
describe("Point class constructor tests", () => {
    let mockED25519;
    let mockSECP256K1;
    beforeEach(() => {
        mockED25519 = new src_1.Curve(src_1.CurveName.ED25519); // Replace with actual initialization if necessary
        mockSECP256K1 = new src_1.Curve(src_1.CurveName.SECP256K1); // Replace with actual initialization if necessary
    });
    it("should create a point successfully with valid parameters, ED25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        expect(point).toBeInstanceOf(src_1.Point);
        expect(point.x).toBe(data_1.valid_coordinates_ed25519[0]);
        expect(point.y).toBe(data_1.valid_coordinates_ed25519[1]);
    });
    it("should create a point successfully with valid parameters, SECP256K1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        expect(point).toBeInstanceOf(src_1.Point);
        expect(point.x).toBe(data_1.valid_coordinates_secp256k1[0]);
        expect(point.y).toBe(data_1.valid_coordinates_secp256k1[1]);
    });
    it("should throw notOnCurve error when point is not on the curve, ED25519", () => {
        const x = BigInt(10);
        const y = BigInt(20);
        expect(() => new src_1.Point(mockED25519, [x, y])).toThrow((0, errors_1.notOnCurve)(`[${x}, ${y}]`));
    });
    it("should throw notOnCurve error when point is not on the curve, SECP256K1", () => {
        const x = BigInt(10);
        const y = BigInt(20);
        expect(() => new src_1.Point(mockSECP256K1, [x, y])).toThrow((0, errors_1.notOnCurve)(`[${x}, ${y}]`));
    });
});
