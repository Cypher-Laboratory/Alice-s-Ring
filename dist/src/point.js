"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
const curves_1 = require("./curves");
const noble_SECP256k1_1 = require("./utils/noble-libraries/noble-SECP256k1");
const noble_ED25519_1 = require("./utils/noble-libraries/noble-ED25519");
const utils_1 = require("./utils");
const ringSignature_1 = require("./ringSignature");
const errors_1 = require("./errors");
/**
 * A point on the elliptic curve.
 */
class Point {
    /**
     * Creates a point instance.
     *
     * @param curve - The curve
     * @param coordinates - The point coordinates ([x,y])
     * @param generator - if true, the point is a generator point
     * @param safeMode - if true, the point is checked to be on the curve
     *
     * @throws if the point is not on the curve
     *
     * @returns the point
     */
    constructor(curve, coordinates, safeMode = true) {
        this.curve = curve;
        this.x = coordinates[0];
        this.y = coordinates[1];
        if (safeMode && !curve.isOnCurve([this.x, this.y])) {
            throw (0, errors_1.notOnCurve)(`[${this.x}, ${this.y}]`);
        }
    }
    /**
     * Multiplies a scalar by a point on the elliptic curve.
     *
     * @param scalar - the scalar to multiply
     * @param point - the point to multiply
     *
     * @returns the result of the multiplication
     */
    mult(scalar) {
        if (scalar === BigInt(0))
            throw (0, errors_1.invalidParams)("invalid scalar : 0");
        switch (this.curve.name) {
            case curves_1.CurveName.SECP256K1: {
                const result = noble_SECP256k1_1.ProjectivePoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).mul((0, utils_1.modulo)(scalar, this.curve.N));
                return new Point(this.curve, [result.x, result.y]);
            }
            case curves_1.CurveName.ED25519: {
                const result = noble_ED25519_1.ExtendedPoint.fromAffine({
                    x: this.x,
                    y: this.y,
                }).mul((0, utils_1.modulo)(scalar, this.curve.N));
                return new Point(this.curve, [result.x, result.y]);
            }
            default: {
                throw (0, errors_1.unknownCurve)(this.curve.name);
            }
        }
    }
    /**
     * Adds two points on the elliptic curve.
     *
     * @param point - the point to add
     * @returns the result of the addition as a new Point
     */
    add(point) {
        if (this.curve.name !== point.curve.name)
            throw (0, errors_1.differentCurves)("Cannot add points");
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
                throw (0, errors_1.unknownCurve)(this.curve.name);
            }
        }
    }
    /**
     * Checks if two points are equal.
     *
     * @param point - the point to compare to
     * @returns true if the points are equal, false otherwise
     */
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
                throw (0, errors_1.unknownCurve)();
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
                throw (0, errors_1.unknownCurve)("Cannot negate point");
            }
        }
    }
    /**
     * Converts a point to its affine representation.
     *
     * @returns the affine representation of the point
     */
    toAffine() {
        return [this.x, this.y];
    }
    /**
     * Converts a point to its json string representation.
     *
     * @returns the json string representation of the point
     */
    toString() {
        return JSON.stringify({
            curve: this.curve.toString(),
            x: this.x.toString(),
            y: this.y.toString(),
        });
    }
    /**
     * Converts a json string to a point.
     *
     * @param string - the json string representation of the point
     * @returns the point
     */
    static fromString(string) {
        const data = JSON.parse(string);
        return new Point(curves_1.Curve.fromString(data.curve), [
            BigInt(data.x),
            BigInt(data.y),
        ]);
    }
    /**
     * Converts a point to its base64 string representation.
     */
    toBase64() {
        // save x, y and curve in json and encode it
        const json = JSON.stringify({
            x: this.x.toString(),
            y: this.y.toString(),
            curve: this.curve.toString(),
        });
        return Buffer.from(json).toString("base64");
    }
    /**
     * Converts a base64 string to a point.
     *
     * @param base64 - the base64 string representation of the point
     * @returns the point
     */
    static fromBase64(base64) {
        // decode base64
        const json = Buffer.from(base64, "base64").toString("ascii");
        const { x, y, curve } = JSON.parse(json);
        const retrievedCurve = curves_1.Curve.fromString(curve);
        return new Point(retrievedCurve, [BigInt(x), BigInt(y)]);
    }
    isValid() {
        try {
            (0, ringSignature_1.checkPoint)(this);
        }
        catch (error) {
            return false;
        }
        return true;
    }
}
exports.Point = Point;
