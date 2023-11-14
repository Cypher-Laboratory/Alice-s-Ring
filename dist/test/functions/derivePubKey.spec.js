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
const curves_1 = require("../../src/curves");
const data = __importStar(require("../data"));
const secp256k1 = new curves_1.Curve(curves_1.CurveName.SECP256K1);
const ed25519 = new curves_1.Curve(curves_1.CurveName.ED25519);
/**
 * Test derivePubKey()
 *
 * test if:
 * - the method returns the correct pubkey (secp256k1)
 * - the method returns the correct pubkey (ed25519)
 * - the method throws an error if the private key is invalid (secp256k1)
 * - the method throws an error if the private key is invalid (ed25519)
 */
describe("Test derivePubKey()", () => {
    it("Should return the correct pubkey - secp256k1", () => {
        const pubkey = (0, curves_1.derivePubKey)(data.signerPrivKey, secp256k1);
        let result = true;
        if (pubkey.x !== data.signerPubKey_secp256k1.x ||
            pubkey.y !== data.signerPubKey_secp256k1.y ||
            pubkey.curve.name !== data.signerPubKey_secp256k1.curve.name) {
            result = false;
        }
        expect(result).toBe(true);
    });
    it("Should return the correct pubkey - ed25519", () => {
        const pubkey = (0, curves_1.derivePubKey)(data.signerPrivKey, ed25519);
        let result = true;
        if (pubkey.x !== data.signerPubKey_ed25519.x ||
            pubkey.y !== data.signerPubKey_ed25519.y ||
            pubkey.curve.name !== data.signerPubKey_ed25519.curve.name) {
            result = false;
        }
        expect(result).toBe(true);
    });
    it("Should throw an error if the private key is invalid - secp256k1", () => {
        expect(() => {
            (0, curves_1.derivePubKey)(0n, secp256k1);
        }).toThrow();
    });
    it("Should throw an error if the private key is invalid - ed25519", () => {
        expect(() => {
            (0, curves_1.derivePubKey)(0n, ed25519);
        }).toThrow();
    });
});
