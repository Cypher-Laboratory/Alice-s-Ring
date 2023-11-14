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
const data = __importStar(require("../data"));
/**
 * Test the RingSignature.base64ToPartialSig() method
 *
 * test if:
 * - the method returns a valid partialSig object from a valid base64 encoded string
 * - the method throws an error if the input is not a valid base64 encoded string
 * - the method throws an error if decoded input is not a valid json object
 */
describe("Test base64ToPartialSig()", () => {
    it("Should return a valid PartialSig object", () => {
        const partialSig = src_1.RingSignature.base64ToPartialSig(data.jsonRS.validBase64PartialSig);
        expect(partialSig).toBeInstanceOf(Object);
        expect(partialSig).toHaveProperty("alpha");
        expect(partialSig).toHaveProperty("cpi");
        expect(partialSig).toHaveProperty("ring");
        expect(partialSig).toHaveProperty("message");
        expect(partialSig).toHaveProperty("curve");
        expect(partialSig).toHaveProperty("config");
    });
    it("Should throw an error if the input is not a valid base64String", () => {
        expect(() => {
            src_1.RingSignature.base64ToPartialSig(JSON.stringify(data.jsonRS.invalidBase64Str));
        }).toThrow((0, errors_1.invalidBase64)());
    });
    it("Should throw an error if the decoded input is not a valid json object", () => {
        expect(() => {
            src_1.RingSignature.base64ToPartialSig(Buffer.from("Not a json object").toString("base64"));
        }).toThrow((0, errors_1.invalidBase64)());
    });
});
