"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const data_1 = require("../data");
describe("Point class mult operation tests", () => {
    let mockED25519;
    let mockSECP256K1;
    beforeEach(() => {
        mockED25519 = new src_1.Curve(src_1.CurveName.ED25519); // Replace with actual initialization if necessary
        mockSECP256K1 = new src_1.Curve(src_1.CurveName.SECP256K1); // Replace with actual initialization if necessary
    });
    it("should mult a point with a positif scalar correctly, ED25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        const scalar = BigInt(10);
        const result = point.mult(scalar);
        expect(result).toBeInstanceOf(src_1.Point);
    });
    it("should mult a point with a positif scalar correctly, SECP256K1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        const scalar = BigInt(10);
        const result = point.mult(scalar);
        expect(result).toBeInstanceOf(src_1.Point);
    });
    it("should mult a point with a negatif scalar correctly, ED25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        const scalar = BigInt(-10);
        const result = point.mult(scalar);
        expect(result).toBeInstanceOf(src_1.Point);
    });
    it("should mult a point with a negatif scalar correctly, SECP256K1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        const scalar = BigInt(-10);
        const result = point.mult(scalar);
        expect(result).toBeInstanceOf(src_1.Point);
    });
    it("should throw compututation error if the scalar equal 0, ED25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        const scalar = BigInt(0);
        expect(() => point.mult(scalar)).toThrow("Invalid param: invalid scalar : 0");
    });
    it("should throw computation error when point is not on the curve, SECP256K1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        const scalar = BigInt(0);
        expect(() => point.mult(scalar)).toThrow("Invalid param: invalid scalar : 0");
    });
});
