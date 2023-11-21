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
const src_1 = require("../src");
const data = __importStar(require("../test/data"));
const curve = new src_1.Curve(src_1.CurveName.SECP256K1);
const message = "Hello world !";
const signerPrivKey = 47051336597389160587656532098427095267996634998425092693862103756529453934308865022401716n;
const ring = data.publicKeys_secp256k1;
const signature = src_1.RingSignature.sign(ring, signerPrivKey, message, curve);
const verified = signature.verify();
console.log("Signature: ", "\n\tmessage digest: ", signature.messageDigest, "\n\tseed: ", signature.getChallenge(), "\n\tresponses: ", signature.getResponses(), "\n\tcurve: ", signature.getCurve().name, "\n\tverified: ", verified);
