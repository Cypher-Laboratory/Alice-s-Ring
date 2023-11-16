"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const data_1 = require("../data");
describe("Point class toAffine()", () => {
    let mockED25519;
    let mockSECP256K1;
    beforeEach(() => {
        mockED25519 = new src_1.Curve(src_1.CurveName.ED25519); // Replace with actual initialization if necessary
        mockSECP256K1 = new src_1.Curve(src_1.CurveName.SECP256K1); // Replace with actual initialization if necessary
    });
    it("should return a [bigint, bigint], ED25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        const affine = point.toAffine();
        expect(affine).toBeInstanceOf(Array);
        expect(affine[0]).toEqual(data_1.valid_coordinates_ed25519[0]);
        expect(affine[1]).toEqual(data_1.valid_coordinates_ed25519[1]);
    });
    it("should return a [bigint, bigint], SECP256K1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        const affine = point.toAffine();
        expect(affine).toBeInstanceOf(Array);
        expect(affine[0]).toEqual(data_1.valid_coordinates_secp256k1[0]);
        expect(affine[1]).toEqual(data_1.valid_coordinates_secp256k1[1]);
    });
});
