"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modulo = void 0;
function modulo(n, p) {
    if (Array.isArray(n)) {
        return n.map((coord) => modulo(coord, p));
    }
    const result = n % p;
    return result >= 0n ? result : result + p;
}
exports.modulo = modulo;
