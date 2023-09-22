"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negate = exports.add = exports.mult = void 0;
const Curves_1 = require("./Curves");
const noble_SECP256k1_1 = require("./noble-SECP256k1");
/**
 * Multiplies a scalar by a point on the elliptic curve.
 *
 * @param scalar - the scalar to multiply
 * @param point - the point to multiply
 * @returns the result of the multiplication
 */
function mult(scalar, point, curve = Curves_1.Curve.SECP256K1) {
    switch (curve) {
        case Curves_1.Curve.SECP256K1: {
            const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                x: point[0],
                y: point[1],
            }).mul(scalar);
            return [result.x, result.y];
        }
        case Curves_1.Curve.ED25519: {
            throw new Error("Not implemented");
        }
        default: {
            throw new Error("Unknown curve");
        }
    }
}
exports.mult = mult;
function add(point1, point2, curve = Curves_1.Curve.SECP256K1) {
    switch (curve) {
        case Curves_1.Curve.SECP256K1: {
            const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                x: point1[0],
                y: point1[1],
            }).add(noble_SECP256k1_1.ProjectivePoint.fromAffine({
                x: point2[0],
                y: point2[1],
            }));
            return [result.x, result.y];
        }
        case Curves_1.Curve.ED25519: {
            throw new Error("Not implemented");
        }
        default: {
            throw new Error("Unknown curve");
        }
    }
}
exports.add = add;
/**
 * Negates a point on the elliptic curve.
 *
 * @param point
 * @param curve
 *
 * @returns
 */
function negate(point, curve = Curves_1.Curve.SECP256K1) {
    switch (curve) {
        case Curves_1.Curve.SECP256K1: {
            const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                x: point[0],
                y: point[1],
            }).negate();
            return [result.x, result.y];
        }
        case Curves_1.Curve.ED25519: {
            throw new Error("Not implemented");
        }
        default: {
            throw new Error("Unknown curve");
        }
    }
}
exports.negate = negate;
