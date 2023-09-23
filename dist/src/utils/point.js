"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
const curves_1 = require("./curves");
const noble_SECP256k1_1 = require("./noble-libraries/noble-SECP256k1");
const noble_ED25519_1 = require("./noble-libraries/noble-ED25519");
const _1 = require(".");
/**
 * A point on the elliptic curve.
 */
class Point {
    constructor(curve, coordinates) {
        this.curve = curve;
        this.x = coordinates[0];
        this.y = coordinates[1];
    }
    /**
     * Multiplies a scalar by a point on the elliptic curve.
     *
     * @param scalar - the scalar to multiply
     * @param point - the point to multiply
     * @returns the result of the multiplication
     */
    mult(scalar) {
        switch (this.curve) {
            case curves_1.Curve.SECP256K1: {
                const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).mul(scalar);
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.Curve.ED25519: {
                const result = noble_ED25519_1.Point.fromAffine({
                    x: this.x,
                    y: this.y,
                }).mul(scalar);
                return new Point(this.curve, [result.x, result.y]);
            }
            default: {
                throw new Error("Unknown curve");
            }
        }
    }
    add(point, curve = curves_1.Curve.SECP256K1) {
        switch (curve) {
            case curves_1.Curve.SECP256K1: {
                const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).add(noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: point.x,
                    y: point.y,
                }));
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.Curve.ED25519: {
                const result = noble_ED25519_1.Point.fromAffine({
                    x: this.x,
                    y: this.y,
                })
                    .add(noble_ED25519_1.Point.fromAffine({
                    x: point.x,
                    y: point.y,
                }));
                return new Point(this.curve, [result.x, result.y]);
            }
            default: {
                throw new Error("Unknown curve");
            }
        }
    }
    /**
     * Negates a point on the elliptic curve.
     *
     * @param point
     * @param curve
     *
     * @returns
     */
    negate() {
        switch (this.curve) {
            case curves_1.Curve.SECP256K1: {
                const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).negate();
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.Curve.ED25519: {
                const result = noble_ED25519_1.Point.fromAffine({
                    x: this.x,
                    y: this.y,
                }).negate();
                return new Point(this.curve, [result.x, result.y]);
            }
            default: {
                throw new Error("Unknown curve");
            }
        }
    }
    modulo(p) {
        return new Point(this.curve, [(0, _1.modulo)(this.x, p), (0, _1.modulo)(this.y, p)]);
    }
    toBigintArray() {
        return [this.x, this.y];
    }
    toString() {
        return String([this.x, this.y]);
    }
}
exports.Point = Point;
