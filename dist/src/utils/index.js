"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToHex = exports.modPow = exports.base64Regex = exports.sha_512 = exports.hash = exports.keccak_256 = exports.modulo = exports.randomBigint = void 0;
var randomNumbers_1 = require("./randomNumbers");
Object.defineProperty(exports, "randomBigint", { enumerable: true, get: function () { return randomNumbers_1.randomBigint; } });
var modulo_1 = require("./modulo");
Object.defineProperty(exports, "modulo", { enumerable: true, get: function () { return modulo_1.modulo; } });
var hashFunction_1 = require("./hashFunction");
Object.defineProperty(exports, "keccak_256", { enumerable: true, get: function () { return hashFunction_1.keccak_256; } });
Object.defineProperty(exports, "hash", { enumerable: true, get: function () { return hashFunction_1.hash; } });
Object.defineProperty(exports, "sha_512", { enumerable: true, get: function () { return hashFunction_1.sha_512; } });
var base64_1 = require("./base64");
Object.defineProperty(exports, "base64Regex", { enumerable: true, get: function () { return base64_1.base64Regex; } });
var modPow_1 = require("./modPow");
Object.defineProperty(exports, "modPow", { enumerable: true, get: function () { return modPow_1.modPow; } });
/**
 * Utils function to cast uint8 array to hex string
 * @param array - The array to cast
 * @returns The hex string
 */
function uint8ArrayToHex(array) {
    let hex = "";
    for (let i = 0; i < array.length; i++) {
        hex += ("00" + array[i].toString(16)).slice(-2);
    }
    return hex;
}
exports.uint8ArrayToHex = uint8ArrayToHex;
