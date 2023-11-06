"use strict";
/**
 * Utils fonction to cast uint8 array to hex string
 * @param array - The array to cast
 * @returns The hex string
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToHex = void 0;
function uint8ArrayToHex(array) {
    let hex = "";
    for (let i = 0; i < array.length; i++) {
        hex += ("00" + array[i].toString(16)).slice(-2);
    }
    return hex;
}
exports.uint8ArrayToHex = uint8ArrayToHex;
