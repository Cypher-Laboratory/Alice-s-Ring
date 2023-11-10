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
const points = __importStar(require("../points"));
const message = __importStar(require("../message"));
const errors_1 = require("../../src/errors");
const hashFunction_1 = require("../../src/utils/hashFunction");
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
describe("Test Constructor", () => {
    /**
     * Test constructor with invalid parameters:
     * - msg is empty
     * - ring is empty
     * - ring contains at least 1 point that is not on the curve
     * - ring contains at least 1 point that is (0, 0)
     * - ring and responses length do not match
     */
    describe("Test constructor with invalid parameters", () => {
        /* -------------TEST INVALID MSG------------- */
        it("Should throw if msg is empty - ed25519", () => {
            expect(() => new src_1.RingSignature("", points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519)).toThrow(errors_1.noEmptyMsg);
        });
        it("Should throw if msg is empty - secp256k1", () => {
            expect(() => new src_1.RingSignature("", points.publicKeys_secp256k1, points.randomC, points.randomResponses, secp256k1)).toThrow(errors_1.noEmptyMsg);
        });
        /* -------------TEST INVALID RING------------- */
        it("Should throw if public keys are empty - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, [], points.randomC, points.randomResponses, ed25519)).toThrow(errors_1.noEmptyRing);
        });
        it("Should throw if public keys are empty - secp256k1", () => {
            expect(() => new src_1.RingSignature(message.message, [], points.randomC, points.randomResponses, secp256k1)).toThrow(errors_1.noEmptyRing);
        });
        it("Should throw if at least 1 public key is not on the curve - ed25519", () => {
            const ring = points.publicKeys_ed25519.slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(ed25519, [2n, 3n])].concat(ring), points.randomC, points.randomResponses, ed25519)).toThrow((0, errors_1.notOnCurve)(`[2, 3]`));
        });
        it("Should throw if at least 1 public key is not on the curve - secp256k1", () => {
            const ring = points.publicKeys_secp256k1.slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(secp256k1, [2n, 3n])].concat(ring), points.randomC, points.randomResponses, secp256k1)).toThrow((0, errors_1.notOnCurve)(`[2, 3]`));
        });
        it("Should throw if one point is (0, 0) - ed25519", () => {
            const ring = points.publicKeys_ed25519.slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(ed25519, [0n, 0n])].concat(ring), points.randomC, points.randomResponses, ed25519)).toThrow((0, errors_1.invalidParams)("Point is not on curve: 0,0"));
        });
        it("Should throw if one point is (0, 0) - secp256k1", () => {
            const ring = points.publicKeys_secp256k1.slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(secp256k1, [0n, 0n])].concat(ring), points.randomC, points.randomResponses, secp256k1)).toThrow((0, errors_1.invalidParams)("Point is not on curve: 0,0"));
        });
        /* -------------TEST INVALID RING<->RESPONSES CORRELATION------------- */
        it("Should throw if ring and responses length do not match - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses.slice(1), ed25519)).toThrow((0, errors_1.lengthMismatch)("ring", "responses"));
        });
        it("Should throw if ring and responses length do not match - secp256k1", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_secp256k1, points.randomC, points.randomResponses.slice(1), secp256k1)).toThrow((0, errors_1.lengthMismatch)("ring", "responses"));
        });
        /* -------------TEST INVALID RESPONSES------------- */
        it("Should throw if at least 1 response is 0 - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, // [0n].concat(points.randomResponses.slice(1)),
            ed25519)).toThrow(errors_1.invalidResponses);
        });
        it("Should throw if at least 1 response is 0 - secp256k1", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_secp256k1, points.randomC, [0n].concat(points.randomResponses.slice(1)), secp256k1)).toThrow(errors_1.invalidResponses);
        });
        /* -------------TEST INVALID C------------- */
        it("Should throw if c is 0 - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, 0n, points.randomResponses, ed25519)).toThrow((0, errors_1.invalidParams)("c"));
        });
        it("Should throw if c is 0 - secp256k1", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_secp256k1, 0n, points.randomResponses, secp256k1)).toThrow((0, errors_1.invalidParams)("c"));
        });
        /* -------------TEST UNKNOWN CURVE------------- */
        it("Should throw if curve is invalid", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, new src_1.Curve(src_1.CurveName.CUSTOM))).toThrow((0, errors_1.invalidParams)("Curve parameters are missing"));
        });
        /* -------------TEST CONFIG.EVMCOMPATIBILITY------------- */
        it("Should pass if config.evmCompatibility is true", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, { evmCompatibility: true }));
        });
        it("Should pass if config.evmCompatibility is false", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, { evmCompatibility: false }));
        });
        it("Should pass if config.evmCompatibility is not undefined", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, {}));
        });
        /* -------------TEST CONFIG.SAFEMODE------------- */
        it("Should pass if config.safeMode is true", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, { safeMode: true }));
        });
        it("Should pass if config.safeMode is false", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, { safeMode: false }));
        });
        it("Should pass if config.safeMode is not undefined", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, {}));
        });
        /* -------------TEST CONFIG.HASH------------- */
        it("Should pass if config.hash is keccack256", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, { hash: hashFunction_1.hashFunction.KECCAK256 }));
        });
        it("Should pass if config.hash is sha512", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, { hash: hashFunction_1.hashFunction.SHA512 }));
        });
        it("Should pass if config.hash is not undefined", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519, {}));
        });
    });
    describe("Test constructor with valid parameters", () => {
        it("Should pass if all parameters are valid - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_ed25519, points.randomC, points.randomResponses, ed25519));
        });
        it("Should pass if all parameters are valid - secp256k1", () => {
            expect(() => new src_1.RingSignature(message.message, points.publicKeys_secp256k1, points.randomC, points.randomResponses, secp256k1));
        });
    });
});
