"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modulo = void 0;
/**
 * compute the modulo of two bigints
 *
 * @param n the bigint to compute the modulo of
 * @param p the modulo
 * @returns n mod p
 */
function modulo(n, p) {
    const result = n % p;
    return result >= 0n ? result : result + p;
}
exports.modulo = modulo;
