import { P } from "./";

/**
 * Compresses a point from an elliptic curve into a single bigint
 *
 * @param point - The point to compress
 * @returns The compressed point
 */
export function compressPoint(point: [bigint, bigint]): bigint {
    const [x, y] = point;
    const parityFlag = y & 1n ? 3n : 2n;
    return (parityFlag << 256n) + x;
}

// y^2 = x^3 + 7
