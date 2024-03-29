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
const data = __importStar(require("../data"));
const isRingSorted_1 = require("../../src/utils/isRingSorted");
const ringSignature_1 = require("../../src/ringSignature");
describe("Test isRingSorted() SECP256K1", () => {
    it("Should return true if the ring is sorted", () => {
        expect((0, isRingSorted_1.isRingSorted)(data.publicKeys_secp256k1)).toBe(true);
    });
    it("Should return false if the ring is not sorted", () => {
        expect((0, isRingSorted_1.isRingSorted)(data.unsortedPublicKeys_secp256k1)).toBe(false);
    });
});
describe("Test isRingSorted() ED25519", () => {
    it("Should return true if the ring is sorted", () => {
        expect((0, isRingSorted_1.isRingSorted)(data.publicKeys_ed25519)).toBe(true);
    });
    it("Should return false if the ring is not sorted", () => {
        expect((0, isRingSorted_1.isRingSorted)(data.unsortedPublicKeys_ed25519)).toBe(false);
    });
});
describe("Test sortRing() SECP256K1", () => {
    it("Should return a sorted ring", () => {
        const sortedRing = (0, ringSignature_1.sortRing)(data.unsortedPublicKeys_secp256k1);
        expect((0, isRingSorted_1.isRingSorted)(sortedRing)).toBe(true);
    });
});
describe("Test sortRing() ED25519", () => {
    it("Should return a sorted ring", () => {
        const sortedRing = (0, ringSignature_1.sortRing)(data.unsortedPublicKeys_ed25519);
        expect((0, isRingSorted_1.isRingSorted)(sortedRing)).toBe(true);
    });
});
