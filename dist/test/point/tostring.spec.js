"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const data_1 = require("../data");
describe("Point class toString()", () => {
    let mockED25519;
    let mockSECP256K1;
    beforeEach(() => {
        mockED25519 = new src_1.Curve(src_1.CurveName.ED25519); // Replace with actual initialization if necessary
        mockSECP256K1 = new src_1.Curve(src_1.CurveName.SECP256K1); // Replace with actual initialization if necessary
    });
    it("should return a string representation of the point, ed25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        expect(() => JSON.parse(point.toString())).not.toThrow();
    });
    it("should return a string representation of the point, secp256k1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        expect(() => JSON.parse(point.toString())).not.toThrow();
    });
});
