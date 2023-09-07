"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.l = exports.G = exports.Gy = exports.Gx = exports.P = void 0;
// SECP256K1 curve constants
exports.P = 2n ** 256n - 2n ** 32n - 977n;
exports.Gx = 55066263022277343669578718895168534326250603453777594175500187360389116729240n;
exports.Gy = 32670510020758816978083085130507043184471273380659243275938904335757337482424n;
exports.G = [exports.Gx, exports.Gy];
exports.l = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"); // n = hl
