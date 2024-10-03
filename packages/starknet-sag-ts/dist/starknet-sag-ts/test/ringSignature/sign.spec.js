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
const ring_sig_utils_1 = require("@cypher-laboratory/ring-sig-utils");
const ringSignature_1 = require("../../src/ringSignature");
const data = __importStar(require("../data"));
const secp256k1 = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.SECP256K1);
const ed25519 = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.ED25519);
// todo: test with evmCompatibility = true
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
        const ringSignature = ringSignature_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1);
        expect(ringSignature).toBeInstanceOf(ringSignature_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    it("Should return a valid ring signature - ed25519", () => {
        const ringSignature = ringSignature_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.message, ed25519);
        expect(ringSignature).toBeInstanceOf(ringSignature_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    it("Should throw if the ring is not valid - secp256k1", () => {
        expect(() => {
            ringSignature_1.RingSignature.sign(data.publicKeys_secp256k1.slice(1).concat(data.idPointX_secp256k1), data.signerPrivKey, data.message, secp256k1);
        }).toThrow("Invalid point: At least one point is not valid: Error: Invalid point: not on curve");
    });
    it("Should throw if the ring is not valid - ed25519", () => {
        expect(() => {
            ringSignature_1.RingSignature.sign(data.publicKeys_ed25519.slice(1).concat(data.idPointX_ed25519), data.signerPrivKey, data.message, ed25519);
        }).toThrow(ring_sig_utils_1.errors.invalidRing("The ring is not sorted"));
    });
    it("Should return a valid signature if the ring is empty - secp256k1", () => {
        const ringSignature = ringSignature_1.RingSignature.sign([], data.signerPrivKey, data.message, secp256k1);
        expect(ringSignature).toBeInstanceOf(ringSignature_1.RingSignature);
        // test if the ring signature is valid
        expect(ringSignature.verify()).toBeTruthy();
    });
    it("Should return a valid signature if the ring is empty - ed25519", () => {
        const ringSignature = ringSignature_1.RingSignature.sign([], data.signerPrivKey, data.message, ed25519);
        expect(ringSignature).toBeInstanceOf(ringSignature_1.RingSignature);
        // test if the ring signature is valid
        expect(ringSignature.verify()).toBeTruthy();
    });
    it("Should throw if signerPrivKey is not valid - secp256k1", () => {
        expect(() => {
            ringSignature_1.RingSignature.sign(data.publicKeys_secp256k1, 0n, data.message, secp256k1);
        }).toThrow(ring_sig_utils_1.errors.invalidParams("Signer private key cannot be 0 and must be < N"));
    });
    it("Should throw if signerPrivKey is not valid - ed25519", () => {
        expect(() => {
            ringSignature_1.RingSignature.sign(data.publicKeys_ed25519, 0n, data.message, ed25519);
        }).toThrow(ring_sig_utils_1.errors.invalidParams("Signer private key cannot be 0 and must be < N"));
    });
});
