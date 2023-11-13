"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Regex = exports.sha_512 = exports.hash = exports.keccak256 = exports.formatPoint = exports.formatRing = exports.uint8ArrayToHex = exports.modulo = exports.getRandomSecuredNumber = exports.randomBigint = void 0;
var randomNumbers_1 = require("./randomNumbers");
Object.defineProperty(exports, "randomBigint", { enumerable: true, get: function () { return randomNumbers_1.randomBigint; } });
Object.defineProperty(exports, "getRandomSecuredNumber", { enumerable: true, get: function () { return randomNumbers_1.getRandomSecuredNumber; } });
var modulo_1 = require("./modulo");
Object.defineProperty(exports, "modulo", { enumerable: true, get: function () { return modulo_1.modulo; } });
var uint8ArrayToHex_1 = require("./convertTypes/uint8ArrayToHex");
Object.defineProperty(exports, "uint8ArrayToHex", { enumerable: true, get: function () { return uint8ArrayToHex_1.uint8ArrayToHex; } });
var formatRing_1 = require("./formatData/formatRing");
Object.defineProperty(exports, "formatRing", { enumerable: true, get: function () { return formatRing_1.formatRing; } });
var formatPoint_1 = require("./formatData/formatPoint");
Object.defineProperty(exports, "formatPoint", { enumerable: true, get: function () { return formatPoint_1.formatPoint; } });
var hashFunction_1 = require("./hashFunction");
Object.defineProperty(exports, "keccak256", { enumerable: true, get: function () { return hashFunction_1.keccak256; } });
Object.defineProperty(exports, "hash", { enumerable: true, get: function () { return hashFunction_1.hash; } });
Object.defineProperty(exports, "sha_512", { enumerable: true, get: function () { return hashFunction_1.sha_512; } });
exports.base64Regex = 
// eslint-disable-next-line no-useless-escape
/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
