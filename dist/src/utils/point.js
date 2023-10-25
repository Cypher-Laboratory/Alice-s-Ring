"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
const curves_1 = require("./curves");
const noble_SECP256k1_1 = require("./noble-libraries/noble-SECP256k1");
const noble_ED25519_1 = require("./noble-libraries/noble-ED25519");
const _1 = require(".");
const elliptic = __importStar(require("elliptic"));
const Ed25519 = new elliptic.eddsa("ed25519");
const secp256k1 = new elliptic.ec("secp256k1");
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
    constructor(curve, coordinates, safeMode = false) {
        this.curve = curve;
        this.x = coordinates[0];
        this.y = coordinates[1];
        if (safeMode) {
            switch (this.curve.name) {
                case curves_1.CurveName.SECP256K1: {
                    if ((0, _1.modulo)(this.x ** 3n + 7n, curve.P) !== (0, _1.modulo)(this.y ** 2n, curve.P)) {
                        throw new Error("Point is not on SECP256K1 curve");
                    }
                    break;
                }
                case curves_1.CurveName.ED25519: {
                    if ((0, _1.modulo)(this.y ** 2n - this.x ** 2n, this.curve.N) !==
                        (0, _1.modulo)(1n - (121665n / 12666n) * this.x ** 2n * this.y ** 2n, this.curve.N)) {
                        throw new Error("Point is not on ED25519 curve");
                    }
                    break;
                }
                default: {
                    console.warn("Unknown curve, cannot check if point is on curve");
                }
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
    /**
     * Adds two points on the elliptic curve.
     *
     * @param point - the point to add
     * @returns the result of the addition as a new Point
     */
    add(point) {
        if (this.curve.name !== point.curve.name)
            throw new Error("Cannot add points: different curves");
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
    /**
     * Converts a hex public key (XRPL standard) to a Point object.
     *
     * @param hex the hex string representation of the public key XRPL Format
     * @returns the point
     *
     */
    static fromHexXRPL(hex) {
        // Check which curve we are on
        if (hex.startsWith("ED")) {
            // Compute on ed25519
            try {
                // Use the `curve.keyFromPublic` method to create a Keypair based on the signing pubkey
                // The keypair is encoded
                // Get ride of the ED prefix indicating that the curve is on ed25519
                const keypair = Ed25519.keyFromPublic(hex.slice(2));
                // get the X and Y value by decoding the point
                const xValue = Ed25519.decodePoint(keypair.getPublic())
                    .getX()
                    .toString(16);
                const yValue = Ed25519.decodePoint(keypair.getPublic())
                    .getY()
                    .toString(16);
                return new Point(new curves_1.Curve(curves_1.CurveName.ED25519), [
                    BigInt("0x" + xValue),
                    BigInt("0x" + yValue),
                ]);
            }
            catch (error) {
                throw new Error("Error while computing coordinates on ed25519: " + error);
            }
        }
        else {
            // Compute on secp256k1
            try {
                // Use the `curve.pointFromX()` method to retrieve the point on the curve
                // Get ride of the prefix (02/03) that indicate if y coordinate is odd or not
                // see xrpl doc here : https://xrpl.org/cryptographic-keys.html
                const point = secp256k1.curve.pointFromX(hex.slice(2));
                // Access the y-coordinate from the retrieved point
                const xValue = point.getX().toString(16);
                const yValue = point.getY().toString(16);
                return new Point(new curves_1.Curve(curves_1.CurveName.ED25519), [
                    BigInt("0x" + xValue),
                    BigInt("0x" + yValue),
                ]);
            }
            catch (error) {
                throw new Error("Error while computing coordinates on secp256k1: " + error);
            }
        }
    }
}
exports.Point = Point;
