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
const ringSignature_1 = require("../src/ringSignature");
const data = __importStar(require("../test/data"));
/**
 * Example of how to use the lib to generate call data for a ring signature using secp256k1
 */
async function callDataSECP256K1() {
    const curve = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.SECP256K1);
    const message = "Hello world !";
    const signerPrivKey = 4705133659738916058765656634998425092693862103756529453934308865022401716n;
    const ring = data.publicKeys_secp256k1.slice(0, 3);
    const signature = ringSignature_1.RingSignature.sign(ring, signerPrivKey, message, curve);
    const rawCallData = await signature.getCallData();
    console.log("SECP256K1 callData value : ", rawCallData.toString());
}
/**
 * Example of how to use the lib to generate call data for a ring using ED25519
 */
async function callDataED25519() {
    const curve = new ring_sig_utils_1.Curve(ring_sig_utils_1.CurveName.ED25519);
    const message = "Hello world !";
    const signerPrivKey = 4705133659738916058765656634998425092693862103756529453934308865022401716n;
    const ring = data.publicKeys_ed25519.slice(0, 3);
    const signature = ringSignature_1.RingSignature.sign(ring, signerPrivKey, message, curve);
    const rawCallData = await signature.getCallData();
    console.log("ED25519 callData value :", rawCallData.toString());
}
callDataSECP256K1();
callDataED25519();
