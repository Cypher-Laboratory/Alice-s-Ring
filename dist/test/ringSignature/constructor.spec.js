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
            expect(() => new src_1.RingSignature("", points.privateKey.map((key) => ed25519.GtoPoint().mult(key)), points.randomC, points.randomResponses, ed25519)).toThrow(new Error("Cannot sign empty message"));
        });
        it("Should throw if msg is empty - secp256k1", () => {
            expect(() => new src_1.RingSignature("", points.privateKey.map((key) => secp256k1.GtoPoint().mult(key)), points.randomC, points.randomResponses, secp256k1)).toThrow(new Error("Cannot sign empty message"));
        });
        /* -------------TEST INVALID MSG------------- */
        it("Should throw if public keys are empty - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, [], points.randomC, points.randomResponses, ed25519)).toThrow(new Error("Ring cannot be empty"));
        });
        it("Should throw if public keys are empty - secp256k1", () => {
            expect(() => new src_1.RingSignature(message.message, [], points.randomC, points.randomResponses, secp256k1)).toThrow(new Error("Ring cannot be empty"));
        });
        it("Should throw if at least 1 public key is not on the curve - ed25519", () => {
            const ring = points.privateKey
                .map((key) => ed25519.GtoPoint().mult(key))
                .slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(ed25519, [2n, 3n])].concat(ring), points.randomC, points.randomResponses, ed25519)).toThrow(new Error("Point is not on the curve"));
        });
        it("Should throw if at least 1 public key is not on the curve - secp256k1", () => {
            const ring = points.privateKey
                .map((key) => secp256k1.GtoPoint().mult(key))
                .slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(secp256k1, [2n, 3n])].concat(ring), points.randomC, points.randomResponses, secp256k1)).toThrow(new Error("Point is not on the curve"));
        });
        it("Should throw if one point is (0, 0) - ed25519", () => {
            const ring = points.privateKey
                .map((key) => ed25519.GtoPoint().mult(key))
                .slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(ed25519, [0n, 0n])].concat(ring), points.randomC, points.randomResponses, ed25519)).toThrow(new Error("Point is not on the curve"));
        });
        it("Should throw if one point is (0, 0) - secp256k1", () => {
            const ring = points.privateKey
                .map((key) => secp256k1.GtoPoint().mult(key))
                .slice(1);
            expect(() => new src_1.RingSignature(message.message, [new src_1.Point(secp256k1, [0n, 0n])].concat(ring), points.randomC, points.randomResponses, secp256k1)).toThrow(new Error("Point is not on the curve"));
        });
        /* -------------TEST INVALID RING<->RESPONSES CORRELATION------------- */
        it("Should throw if ring and responses length do not match - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, points.privateKey.map((key) => ed25519.GtoPoint().mult(key)), points.randomC, points.randomResponses.slice(1), ed25519)).toThrow(new Error("Ring and responses length mismatch"));
        });
        it("Should throw if ring and responses length do not match - secp256k1", () => {
            expect(() => new src_1.RingSignature(message.message, points.privateKey.map((key) => secp256k1.GtoPoint().mult(key)), points.randomC, points.randomResponses.slice(1), secp256k1)).toThrow(new Error("Ring and responses length mismatch"));
        });
        /* -------------TEST INVALID RESPONSES------------- */
        it("Should throw if at least 1 response is 0 - ed25519", () => {
            expect(() => new src_1.RingSignature(message.message, points.privateKey.map((key) => ed25519.GtoPoint().mult(key)), points.randomC, points.randomResponses, // [0n].concat(points.randomResponses.slice(1)),
            ed25519)).toThrow(new Error("at least one response is not valid"));
        });
        // it ("Should throw if at least 1 response is 0 - secp256k1", () => {
        //   expect(() => new RingSignature(
        //     message.message,
        //     points.privateKey.map((key) => secp256k1.GtoPoint().mult(key)),
        //     points.randomC,
        //     [0n].concat(points.randomResponses.slice(1)),
        //     secp256k1
        //   )).toThrow(new Error("at least one response is not valid"));
        // });
    });
});
