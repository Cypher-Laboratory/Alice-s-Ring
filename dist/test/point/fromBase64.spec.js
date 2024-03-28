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
describe("Point class mult operation tests", () => {
    it("Should return a valid Point from it's base64 representation, ed25519", () => {
        const point = src_1.Point.fromBase64(data.base64Point.valid_point_ed25519);
        expect(point).toBeInstanceOf(src_1.Point);
    });
    it("Should return a valid Point from it's base64 representation, secp256k1", () => {
        const point = src_1.Point.fromBase64(data.base64Point.valid_point_secp256k1);
        expect(point).toBeInstanceOf(src_1.Point);
    });
    it("should throw an error if the base64 string is not valid, ed25519", () => {
        expect(() => src_1.Point.fromBase64(data.base64Point.invalid_point_ed25519)).toThrow();
    });
    it("should throw an error if the base64 string is not valid, secp256k1", () => {
        expect(() => src_1.Point.fromBase64(data.base64Point.invalid_point_secp256k1)).toThrow();
    });
    it("should throw if the string is void", () => {
        expect(() => src_1.Point.fromBase64("")).toThrow();
    });
});
