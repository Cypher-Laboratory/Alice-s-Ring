"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ED25519 = exports.SECP256K1 = exports.Curve = void 0;
const noble_ED25519_1 = require("./noble-libraries/noble-ED25519");
/**
 * List of supported curves
 */
var Curve;
(function (Curve) {
    Curve["SECP256K1"] = "SECP256K1";
    Curve["ED25519"] = "ED25519";
    Curve["CUSTOM"] = "CUSTOM";
})(Curve || (exports.Curve = Curve = {}));
// SECP256K1 curve constants
exports.SECP256K1 = {
    P: 2n ** 256n - 2n ** 32n - 977n,
    N: 2n ** 256n - 0x14551231950b75fc4402da1732fc9bebfn,
    Gx: 55066263022277343669578718895168534326250603453777594175500187360389116729240n,
    Gy: 32670510020758816978083085130507043184471273380659243275938904335757337482424n,
    G: [
        55066263022277343669578718895168534326250603453777594175500187360389116729240n,
        32670510020758816978083085130507043184471273380659243275938904335757337482424n,
    ],
};
exports.ED25519 = {
    P: 2n ** 255n - 19n,
    N: 2n ** 252n + 27742317777372353535851937790883648493n,
    G: [noble_ED25519_1.ExtendedPoint.BASE.toAffine().x, noble_ED25519_1.ExtendedPoint.BASE.toAffine().y],
};
