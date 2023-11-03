"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRing = void 0;
/**
 * Formats a ring according to the config.
 *
 * @param ring - the ring to format
 * @param config - the config to use
 * @returns the formatted ring
 */
function formatRing(ring, config) {
    if (config?.evmCompatibility) {
        return ring
            .map((point) => point.x.toString() + point.y.toString())
            .join("");
    }
    return ring;
}
exports.formatRing = formatRing;
