"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const data_1 = require("../data");
describe("Point class fromString()", () => {
    it("should return a point from a string representation of the point, ed25519", () => {
        const point = src_1.Point.fromString(data_1.valid_string_point_ed25519);
        expect(point).toBeInstanceOf(src_1.Point);
    });
    it("should return a point from a string representation of the point, secp256k1", () => {
        const point = src_1.Point.fromString(data_1.valid_string_point_secp256k1);
        expect(point).toBeInstanceOf(src_1.Point);
    });
    it("should throw an error if the string representation of the point is invalid, ed25519", () => {
        expect(() => src_1.Point.fromString(data_1.invalid_string_point_ed25519)).toThrow();
    });
    it("should throw an error if the string representation of the point is invalid, secp256k1", () => {
        expect(() => src_1.Point.fromString(data_1.invalid_string_point_secp256k1)).toThrow();
    });
    it("should throw an error if the string is void", () => {
        expect(() => src_1.Point.fromString("")).toThrow();
    });
});
