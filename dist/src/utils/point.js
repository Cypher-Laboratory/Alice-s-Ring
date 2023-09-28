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
        switch (this.curve.name) {
            case curves_1.CurveName.SECP256K1: {
                const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).mul((0, _1.modulo)(scalar, this.curve.N));
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.CurveName.ED25519: {
                const result = noble_ED25519_1.ExtendedPoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).mul((0, _1.modulo)(scalar, this.curve.N));
                return new Point(this.curve, [result.x, result.y]);
            }
            default: {
                throw new Error("Unknown curve");
            }
        }
    }
    add(point) {
        switch (this.curve.name) {
            case curves_1.CurveName.SECP256K1: {
                const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).add(noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: point.x,
                    y: point.y,
                }));
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.CurveName.ED25519: {
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
    equals(point) {
        if (this.curve !== point.curve)
            return false;
        switch (this.curve.name) {
            case curves_1.CurveName.SECP256K1: {
                return noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).equals(noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: point.x,
                    y: point.y,
                }));
            }
            case curves_1.CurveName.ED25519: {
                return noble_ED25519_1.ExtendedPoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).equals(noble_ED25519_1.ExtendedPoint.fromAffine({
                    x: point.x,
                    y: point.y,
                }));
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
        switch (this.curve.name) {
            case curves_1.CurveName.SECP256K1: {
                const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).negate();
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.CurveName.ED25519: {
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
    toAffine() {
        return [this.x, this.y];
    }
    toString() {
        return String([this.x, this.y]);
    }
    toBase64() {
        // save x, y and curve in json and encode it
        const json = JSON.stringify({
            x: this.x.toString(),
            y: this.y.toString(),
            curve: this.curve.toString(),
        });
        return Buffer.from(json).toString("base64");
    }
    static fromBase64(base64) {
        // decode base64
        const json = Buffer.from(base64, "base64").toString("ascii");
        const { x, y, curve } = JSON.parse(json);
        const retrievedCurve = curves_1.Curve.fromString(curve);
        return new Point(retrievedCurve, [BigInt(x), BigInt(y)]);
    }
}
exports.Point = Point;
