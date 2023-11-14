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
const src_1 = require("../../src");
const errors_1 = require("../../src/errors");
const ringSignature_1 = require("../../src/ringSignature");
const data = __importStar(require("../data"));
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/*
 * Test for checkRing function
 *
 * test if:
 * - returns void if the ring is valid
 * - throws an error if the ring is empty
 * - throws an error if at least one point is not on the specified curve
 * - throws an error if the ring contains duplicates
 * - throws an error if the ring contains invalid points
 */
describe("test checkRing()", () => {
    it("Should return void if the ring is valid", () => {
        expect(() => (0, ringSignature_1.checkRing)(data.publicKeys_secp256k1, secp256k1)).not.toThrow();
    });
    it("Should throw an error if the ring is empty", () => {
        expect(() => (0, ringSignature_1.checkRing)([], secp256k1)).toThrow(errors_1.noEmptyRing);
    });
    it("Should throw an error if at least one point is not on the specified curve", () => {
        expect(() => (0, ringSignature_1.checkRing)(data.publicKeys_secp256k1, ed25519)).toThrow((0, errors_1.invalidPoint)("At least one point is not valid: Error: Curve mismatch"));
    });
    it("Should throw an error if the ring contains duplicates", () => {
        expect(() => (0, ringSignature_1.checkRing)(data.publicKeys_secp256k1.concat(data.publicKeys_secp256k1), secp256k1)).toThrow("Duplicates found in ring");
    });
    it("Should throw an error if the ring contains invalid points", () => {
        const invalid = secp256k1.GtoPoint();
        invalid.x = BigInt(0);
        expect(() => (0, ringSignature_1.checkRing)(data.publicKeys_secp256k1.concat([invalid]), secp256k1)).toThrow((0, errors_1.invalidPoint)(
        // eslint-disable-next-line max-len
        'At least one point is not valid: Error: Invalid param: Point is not on curve: {"curve":"{\\"curve\\":\\"SECP256K1\\",\\"Gx\\":\\"55066263022277343669578718895168534326250603453777594175500187360389116729240\\",\\"Gy\\":\\"32670510020758816978083085130507043184471273380659243275938904335757337482424\\",\\"N\\":\\"115792089237316195423570985008687907852837564279074904382605163141518161494337\\",\\"P\\":\\"115792089237316195423570985008687907853269984665640564039457584007908834671663\\"}","x":"0","y":"32670510020758816978083085130507043184471273380659243275938904335757337482424"}'));
    });
});
