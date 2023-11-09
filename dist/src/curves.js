"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.derivePubKey = exports.Curve = exports.CurveName = void 0;
const noble_ED25519_1 = require("./utils/noble-libraries/noble-ED25519");
const point_1 = require("./point");
const utils_1 = require("./utils");
const errors_1 = require("./errors");
// SECP256K1 curve constants
const SECP256K1 = {
    P: 2n ** 256n - 2n ** 32n - 977n,
    N: 2n ** 256n - 0x14551231950b75fc4402da1732fc9bebfn,
    G: [
        55066263022277343669578718895168534326250603453777594175500187360389116729240n,
        32670510020758816978083085130507043184471273380659243275938904335757337482424n,
    ],
};
// ED25519 curve constants
const GED25519 = new noble_ED25519_1.ExtendedPoint(noble_ED25519_1.Gx, noble_ED25519_1.Gy, 1n, (0, noble_ED25519_1.mod)(noble_ED25519_1.Gx * noble_ED25519_1.Gy));
const ED25519 = {
    P: 2n ** 255n - 19n,
    N: 2n ** 252n + 27742317777372353535851937790883648493n,
    G: [GED25519.toAffine().x, GED25519.toAffine().y],
};
/**
 * List of supported curves
 */
var CurveName;
(function (CurveName) {
    CurveName["SECP256K1"] = "SECP256K1";
    CurveName["ED25519"] = "ED25519";
    CurveName["CUSTOM"] = "CUSTOM";
})(CurveName || (exports.CurveName = CurveName = {}));
class Curve {
    /**
     * Creates a curve instance.
     *
     * @param curve - The curve name
     * @param params - The curve parameters (optional if curve is SECP256K1 or ED25519)
     */
    constructor(curve, params) {
        this.name = curve;
        switch (this.name // TODO: CHECK IF G IS ON CURVE
        ) {
            case CurveName.SECP256K1:
                this.G = SECP256K1.G;
                this.N = SECP256K1.N;
                this.P = SECP256K1.P;
                break;
            case CurveName.ED25519:
                this.G = ED25519.G;
                this.N = ED25519.N;
                this.P = ED25519.P;
                break;
            default:
                if (params) {
                    this.G = params.G;
                    this.N = params.N;
                    this.P = params.P;
                    break;
                }
                throw (0, errors_1.invalidParams)("Curve parameters are missing");
        }
    }
    /**
     * Returns the generator point as a Point instance.
     *
     * @returns the generator point
     */
    GtoPoint() {
        return new point_1.Point(this, this.G);
    }
    /**
     * Returns the curve as a json string.
     */
    toString() {
        return JSON.stringify({
            curve: this.name,
            Gx: this.G[0].toString(),
            Gy: this.G[1].toString(),
            N: this.N.toString(),
            P: this.P.toString(),
        });
    }
    /**
     * Returns a curve instance from a json string.
     *
     * @param curveData - the curve as a json string
     * @returns the curve instance
     */
    static fromString(curveData) {
        const data = JSON.parse(curveData);
        const G = [BigInt(data.Gx), BigInt(data.Gy)];
        const N = BigInt(data.N);
        const P = BigInt(data.P);
        return new Curve(data.curve, { P, G, N });
    }
    /**
     * Checks if a point is on the curve.
     *
     * @param point - the point to check
     * @returns true if the point is on the curve, false otherwise
     */
    isOnCurve(point) {
        let x;
        let y;
        if (point instanceof point_1.Point) {
            x = point.x;
            y = point.y;
        }
        else {
            x = point[0];
            y = point[1];
        }
        switch (this.name) {
            case CurveName.SECP256K1: {
                return (0, utils_1.modulo)(x ** 3n + 7n - y ** 2n, this.P) === 0n;
            }
            case CurveName.ED25519: {
                const d = -4513249062541557337682894930092624173785641285191125241628941591882900924598840740n;
                return ((0, utils_1.modulo)(y ** 2n - x ** 2n - 1n - d * x ** 2n * y ** 2n, this.P) === 0n);
            }
            default: {
                console.warn("Unknown curve, cannot check if point is on curve. Returning true.");
            }
        }
        return true;
    }
    equals(curve) {
        return (this.name === curve.name &&
            this.G[0] === curve.G[0] &&
            this.G[1] === curve.G[1] &&
            this.N === curve.N &&
            this.P === curve.P);
    }
}
exports.Curve = Curve;
/**
 * Derive the public key from the private key.
 *
 * @param privateKey - the private key
 * @param curve - the curve to use
 * @param config - the config to use (optional)
 *
 * @returns the public key
 */
function derivePubKey(privateKey, curve) {
    return curve.GtoPoint().mult(privateKey);
}
exports.derivePubKey = derivePubKey;
