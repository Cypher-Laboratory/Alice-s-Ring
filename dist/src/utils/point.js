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
    /**
     *
     *
     * @param curve - The curve
     * @param coordinates - The point coordinates ([x,y])
     * @param generator - if true, the point is a generator point
     */
    constructor(curve, coordinates, P, G) {
        this.curve = curve;
        this.x = coordinates[0];
        this.y = coordinates[1];
        switch (curve) {
            case curves_1.Curve.SECP256K1: {
                this.P = curves_1.SECP256K1.P;
                this.G = curves_1.SECP256K1.G;
                break;
            }
            case curves_1.Curve.ED25519: {
                this.P = curves_1.ED25519.P;
                this.G = curves_1.ED25519.G;
                break;
            }
            default: {
                if (!P || !G) {
                    throw new Error("Unknown curve");
                }
                this.P = P;
                this.G = G;
            }
        }
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
                }).mul((0, _1.modulo)(scalar, curves_1.SECP256K1.N));
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.Curve.ED25519: {
                const result = noble_ED25519_1.ExtendedPoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).mul((0, _1.modulo)(scalar, curves_1.ED25519.N));
                return new Point(this.curve, [result.x, result.y]);
            }
            default: {
                throw new Error("Unknown curve");
            }
        }
    }
    add(point) {
        switch (this.curve) {
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
                // does not work
                const result = noble_ED25519_1.ExtendedPoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).add(noble_ED25519_1.ExtendedPoint.fromAffine({
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
     * @param point - the point to negate
     *
     * @returns the negated point
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
                const result = noble_ED25519_1.ExtendedPoint.fromAffine({
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
    toAffine() {
        return [this.x, this.y];
    }
    toString() {
        return String([this.x, this.y]);
    }
}
exports.Point = Point;
