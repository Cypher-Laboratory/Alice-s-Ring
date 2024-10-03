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
const ed25519 = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.ED25519);
const secp256k1 = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.SECP256K1);
describe("Test Constructor", () => {
    /**
     * Test constructor with invalid parameters:
     * - msg is empty
     * - ring is empty
     * - ring contains at least 1 point that is not on the curve
     * - ring contains at least 1 point that is (0, 0)
     * - ring and responses length do not match
     * - at least 1 response is 0
     * - c is 0
     */
    describe("Test constructor with invalid parameters", () => {
        /* -------------TEST INVALID RING------------- */
        it("Should throw if public keys are empty - ed25519", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, [], data.randomC, data.randomResponses, ed25519)).toThrow(ring_sig_utils_1.errors.noEmptyRing);
        });
        it("Should throw if public keys are empty - secp256k1", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, [], data.randomC, data.randomResponses, secp256k1)).toThrow(ring_sig_utils_1.errors.noEmptyRing);
        });
        it("Should throw if at least 1 public key is not on the curve - ed25519", () => {
            const ring = data.publicKeys_ed25519.slice(1);
            expect(() => new ringSignature_1.RingSignature(data.message, [new ring_sig_utils_1.Point(ed25519, [2n, 3n])].concat(ring), data.randomC, data.randomResponses, ed25519)).toThrow(ring_sig_utils_1.errors.notOnCurve(`[2, 3]`));
        });
        it("Should throw if at least 1 public key is not on the curve - secp256k1", () => {
            const ring = data.publicKeys_secp256k1.slice(1);
            expect(() => new ringSignature_1.RingSignature(data.message, [new ring_sig_utils_1.Point(secp256k1, [2n, 3n])].concat(ring), data.randomC, data.randomResponses, secp256k1)).toThrow(ring_sig_utils_1.errors.notOnCurve(`[2, 3]`));
        });
        it("Should throw if one point is (0, 0) - ed25519", () => {
            const ring = data.publicKeys_ed25519.slice(1);
            expect(() => new ringSignature_1.RingSignature(data.message, [new ring_sig_utils_1.Point(ed25519, [0n, 0n])].concat(ring), data.randomC, data.randomResponses, ed25519)).toThrow("Point is not on curve: [0, 0]");
        });
        it("Should throw if one point is (0, 0) - secp256k1", () => {
            const ring = data.publicKeys_secp256k1.slice(1);
            expect(() => new ringSignature_1.RingSignature(data.message, [new ring_sig_utils_1.Point(secp256k1, [0n, 0n])].concat(ring), data.randomC, data.randomResponses, secp256k1)).toThrow("Point is not on curve: [0, 0]");
        });
        /* -------------TEST INVALID RING<->RESPONSES CORRELATION------------- */
        it("Should throw if ring and responses length do not match - ed25519", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_ed25519, data.randomC, data.randomResponses.slice(1), ed25519)).toThrow(ring_sig_utils_1.errors.lengthMismatch("ring", "responses"));
        });
        it("Should throw if ring and responses length do not match - secp256k1", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_secp256k1, data.randomC, data.randomResponses.slice(1), secp256k1)).toThrow(ring_sig_utils_1.errors.lengthMismatch("ring", "responses"));
        });
        /* -------------TEST INVALID RESPONSES------------- */
        it("Should throw if at least 1 response is 0 - ed25519", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_ed25519, data.randomC, data.randomResponses, // [0n].concat(data.randomResponses.slice(1)),
            ed25519)).toThrow(ring_sig_utils_1.errors.invalidResponses);
        });
        it("Should throw if at least 1 response is 0 - secp256k1", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_secp256k1, data.randomC, [0n].concat(data.randomResponses.slice(1)), secp256k1)).toThrow(ring_sig_utils_1.errors.invalidResponses);
        });
        /* -------------TEST UNKNOWN CURVE------------- */
        it("Should throw if curve is invalid", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_ed25519, data.randomC, data.randomResponses, new ring_sig_utils_1.Curve("invalid name"))).toThrow(ring_sig_utils_1.errors.unknownCurve("invalid name"));
        });
    });
    describe("Test constructor with valid parameters", () => {
        it("Should pass if all parameters are valid - ed25519", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_ed25519, data.randomC, data.randomResponses, ed25519));
        });
        it("Should pass if all parameters are valid - secp256k1", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_secp256k1, data.randomC, data.randomResponses, secp256k1));
        });
        it("Should throw if at least 1 response is 0 - ed25519", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_ed25519, data.randomC, [0n].concat(data.randomResponses.slice(1)), ed25519)).toThrow(ring_sig_utils_1.errors.invalidResponses);
        });
        it("Should throw if at least 1 response is 0 - secp256k1", () => {
            expect(() => new ringSignature_1.RingSignature(data.message, data.publicKeys_secp256k1, data.randomC, [0n].concat(data.randomResponses.slice(1)), secp256k1)).toThrow(ring_sig_utils_1.errors.invalidResponses);
        });
    });
});
