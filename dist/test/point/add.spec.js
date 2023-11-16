"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const data_1 = require("../data");
describe("Point class add operation tests", () => {
    let mockED25519;
    let mockSECP256K1;
    beforeEach(() => {
        mockED25519 = new src_1.Curve(src_1.CurveName.ED25519); // Replace with actual initialization if necessary
        mockSECP256K1 = new src_1.Curve(src_1.CurveName.SECP256K1); // Replace with actual initialization if necessary
    });
    it("should add a point with a valid point correctly, ED25519", () => {
        const point1 = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        const point2 = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        const result = point1.add(point2);
        expect(result).toBeInstanceOf(src_1.Point);
    });
    it("should mult a point with a valid point correctly, SECP256K1", () => {
        const point1 = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        const point2 = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        const result = point1.add(point2);
        expect(result).toBeInstanceOf(src_1.Point);
    });
    it("should throw if a point is add to an invalid point, ED25519", () => {
        const point = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        const point2 = new src_1.Point(mockED25519, data_1.valid_coordinates_ed25519);
        point2.x = BigInt(0);
        point2.y = BigInt(0);
        expect(() => point.add(point2)).toThrow("Invalid param: Point is not on curve: 0,0");
    });
    it("should throw if a point is add to an invalid point, SECP256K1", () => {
        const point = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        const point2 = new src_1.Point(mockSECP256K1, data_1.valid_coordinates_secp256k1);
        point2.x = BigInt(0);
        point2.y = BigInt(0);
        expect(() => point.add(point2)).toThrow("Point is not on curve: [85233149523113904332707955280867077860042581461353909305027039188512353390508, 80204508462965011230184082696946080788176686703993204897380531731384489208742]");
    });
});
