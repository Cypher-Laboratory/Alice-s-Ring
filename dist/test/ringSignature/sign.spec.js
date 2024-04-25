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
const data = __importStar(require("../data"));
const errors_1 = require("../../src/errors");
const HashFunction_1 = require("../../src/utils/HashFunction");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/**
 * Test the RingSignature.sign() method
 *
 * test if:
 * - the method returns a valid RingSignature object
 * - the method throws if the ring is not valid
 * - the method returns a valid signature if the ring is empty
 * - the method throws if signerPrivKey is not valid
 * - the method throws if the message is empty
 * - the method returns a valid ring signature if config.hash is SHA512
 */
describe("Test sign()", () => {
    /* ------------RINGSIZE > 0------------ */
    it("Should return a valid ring signature - secp256k1", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1);
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    it("Should return a valid ring signature - ed25519", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.message, ed25519);
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    it("Should throw if the ring is not valid - secp256k1", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_secp256k1.slice(1).concat(data.idPointX_secp256k1), data.signerPrivKey, data.message, secp256k1);
        }).toThrow("Invalid point: At least one point is not valid: Error: Invalid point: not on curve");
    });
    it("Should throw if the ring is not valid - ed25519", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_ed25519.slice(1).concat(data.idPointX_ed25519), data.signerPrivKey, data.message, ed25519);
        }).toThrow((0, errors_1.invalidRing)("The ring is not sorted"));
    });
    it("Should return a valid signature if the ring is empty - secp256k1", () => {
        const ringSignature = src_1.RingSignature.sign([], data.signerPrivKey, data.message, secp256k1);
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        // test if the ring signature is valid
        expect(ringSignature.verify()).toBeTruthy();
    });
    it("Should return a valid signature if the ring is empty - ed25519", () => {
        const ringSignature = src_1.RingSignature.sign([], data.signerPrivKey, data.message, ed25519);
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        // test if the ring signature is valid
        expect(ringSignature.verify()).toBeTruthy();
    });
    it("Should throw if signerPrivKey is not valid - secp256k1", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_secp256k1, 0n, data.message, secp256k1);
        }).toThrow((0, errors_1.invalidParams)("Signer private key cannot be 0 and must be < N"));
    });
    it("Should throw if signerPrivKey is not valid - ed25519", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_ed25519, 0n, data.message, ed25519);
        }).toThrow((0, errors_1.invalidParams)("Signer private key cannot be 0 and must be < N"));
    });
    /* ------------CONFIG.HASH = SHA512------------ */
    it("Should return a valid ring signature if config.hash is SHA512 - secp256k1", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1, { hash: HashFunction_1.HashFunction.SHA512 });
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    it("Should return a valid ring signature if config.hash is SHA512 - ed25519", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.message, ed25519, { hash: HashFunction_1.HashFunction.SHA512 });
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
});
