"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modulo = void 0;
function modulo(n, p) {
    const result = n % p;
    return result >= 0n ? result : result + p;
}
exports.modulo = modulo;
