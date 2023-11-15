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
const piSignature_1 = require("../../src/signature/piSignature");
const hashFunction_1 = require("../../src/utils/hashFunction");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/**
 * Test the RingSignature.sign() method
 *
 * test if:
 * - the method returns a valid RingSignature object
 * - the method throws if the ring is not valid
 * - the method returns a valid Schnorr signature if the ring is empty
 * - the method throws if signerPrivKey is not valid
 * - the method throws if the message is empty
 * - the method returns a valid ring signature if config.evmCompatibility is true
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
        }).toThrow((0, errors_1.invalidRing)(
        // eslint-disable-next-line max-len
        'Error: Invalid point: At least one point is not valid: Error: Invalid param: Point is not on curve: {"curve":"{\\"curve\\":\\"SECP256K1\\",\\"Gx\\":\\"55066263022277343669578718895168534326250603453777594175500187360389116729240\\",\\"Gy\\":\\"32670510020758816978083085130507043184471273380659243275938904335757337482424\\",\\"N\\":\\"115792089237316195423570985008687907852837564279074904382605163141518161494337\\",\\"P\\":\\"115792089237316195423570985008687907853269984665640564039457584007908834671663\\"}","x":"0","y":"1"}'));
    });
    it("Should throw if the ring is not valid - ed25519", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_ed25519.slice(1).concat(data.idPointX_ed25519), data.signerPrivKey, data.message, ed25519);
        }).toThrow((0, errors_1.invalidRing)(
        // eslint-disable-next-line max-len
        'Error: Invalid point: At least one point is not valid: Error: Invalid param: Point is not on curve: {"curve":"{\\"curve\\":\\"ED25519\\",\\"Gx\\":\\"15112221349535400772501151409588531511454012693041857206046113283949847762202\\",\\"Gy\\":\\"46316835694926478169428394003475163141307993866256225615783033603165251855960\\",\\"N\\":\\"7237005577332262213973186563042994240857116359379907606001950938285454250989\\",\\"P\\":\\"57896044618658097711785492504343953926634992332820282019728792003956564819949\\"}","x":"0","y":"1"}'));
    });
    it("Should return a valid Schnorr signature if the ring is empty - secp256k1", () => {
        const ringSignature = src_1.RingSignature.sign([], data.signerPrivKey, data.message, secp256k1);
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        // test if the ring signature is valid
        expect(ringSignature.verify()).toBe(true);
        // test if the ring signature is a Schnorr signature
        expect((0, piSignature_1.verifyPiSignature)(ringSignature.getMessage(), data.signerPubKey_secp256k1, ringSignature.getC(), ringSignature.getResponses()[0], secp256k1, ringSignature.getConfig())).toBe(true);
    });
    it("Should return a valid Schnorr signature if the ring is empty - ed25519", () => {
        const ringSignature = src_1.RingSignature.sign([], data.signerPrivKey, data.message, ed25519);
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        // test if the ring signature is valid
        expect(ringSignature.verify()).toBeTruthy();
        // test if the ring signature is a Schnorr signature
        expect((0, piSignature_1.verifyPiSignature)(ringSignature.getMessage(), data.signerPubKey_ed25519, ringSignature.getC(), ringSignature.getResponses()[0], ed25519, ringSignature.getConfig())).toBe(true);
    });
    it("Should throw if signerPrivKey is not valid - secp256k1", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_secp256k1, 0n, data.message, secp256k1);
        }).toThrow((0, errors_1.invalidParams)("Signer private key cannot be 0"));
    });
    it("Should throw if signerPrivKey is not valid - ed25519", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_ed25519, 0n, data.message, ed25519);
        }).toThrow((0, errors_1.invalidParams)("Signer private key cannot be 0"));
    });
    it("Should throw if the message is empty - secp256k1", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.emptyMessage, secp256k1);
        }).toThrow("Cannot sign empty message");
    });
    it("Should throw if the message is empty - ed25519", () => {
        expect(() => {
            src_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.emptyMessage, ed25519);
        }).toThrow("Cannot sign empty message");
    });
    /* ------------CONFIG.EVMCOMPATIBILITY = TRUE------------ */
    it("Should return a valid ring signature if config.evmCompatibility is true - secp256k1", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1, { evmCompatibility: true });
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    it("Should return a valid ring signature if config.evmCompatibility is true - ed25519", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.message, ed25519, { evmCompatibility: true });
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    /* ------------CONFIG.HASH = SHA512------------ */
    it("Should return a valid ring signature if config.hash is SHA512 - secp256k1", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_secp256k1, data.signerPrivKey, data.message, secp256k1, { hash: hashFunction_1.hashFunction.SHA512 });
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
    it("Should return a valid ring signature if config.hash is SHA512 - ed25519", () => {
        const ringSignature = src_1.RingSignature.sign(data.publicKeys_ed25519, data.signerPrivKey, data.message, ed25519, { hash: hashFunction_1.hashFunction.SHA512 });
        expect(ringSignature).toBeInstanceOf(src_1.RingSignature);
        expect(ringSignature.verify()).toBe(true);
    });
});
