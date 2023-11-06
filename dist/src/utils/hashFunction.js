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
exports.sha_512 = exports.keccak256 = void 0;
const uint8ArrayToHex_1 = require("./convertTypes/uint8ArrayToHex");
const sha3_1 = require("@noble/hashes/sha3");
const ed = __importStar(require("../utils/noble-libraries/noble-ED25519"));
const sha512_1 = require("@noble/hashes/sha512");
ed.etc.sha512Sync = (...m) => (0, sha512_1.sha512)(ed.etc.concatBytes(...m));
function keccak256(input) {
    return (0, uint8ArrayToHex_1.uint8ArrayToHex)((0, sha3_1.keccak_256)(input));
}
exports.keccak256 = keccak256;
function sha_512(input) {
    return (0, uint8ArrayToHex_1.uint8ArrayToHex)((0, sha512_1.sha512)(input));
}
exports.sha_512 = sha_512;
