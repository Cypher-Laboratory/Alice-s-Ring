"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const data_1 = require("../data");
describe("Point class isValid()", () => {
    let mockED25519;
    let mockSECP256K1;
    beforeEach(() => {
        mockED25519 = new src_1.Curve(src_1.CurveName.ED25519); // Replace with actual initialization if necessary
        mockSECP256K1 = new src_1.Curve(src_1.CurveName.SECP256K1); // Replace with actual initialization if necessary
    });
    it("should return true if the point is valid, ED25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        expect(point.isValid()).toBeTruthy();
    });
    it("should return true if the point is valid, SECP256K1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        expect(point.isValid()).toBeTruthy();
    });
    it("should return false if the point is invalid, SECP256K1", () => {
        expect(data_1.idPointX_secp256k1.isValid()).toBeFalsy();
    });
});
