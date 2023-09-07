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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.piSignature = exports.altSchnorrVerify = exports.altSchnorrSignature = void 0;
var alt_Schnorr_1 = require("./signature/alt_Schnorr");
Object.defineProperty(exports, "altSchnorrSignature", { enumerable: true, get: function () { return alt_Schnorr_1.altSchnorrSignature; } });
Object.defineProperty(exports, "altSchnorrVerify", { enumerable: true, get: function () { return alt_Schnorr_1.altSchnorrVerify; } });
var piSignature_1 = require("./signature/piSignature");
Object.defineProperty(exports, "piSignature", { enumerable: true, get: function () { return piSignature_1.piSignature; } });
__exportStar(require("./ringSignature"), exports);
