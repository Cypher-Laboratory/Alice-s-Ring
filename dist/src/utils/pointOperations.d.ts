import { Curve } from "./Curves";
/**
 * Multiplies a scalar by a point on the elliptic curve.
 *
 * @param scalar - the scalar to multiply
 * @param point - the point to multiply
 * @returns the result of the multiplication
 */
export declare function mult(scalar: bigint, point: [bigint, bigint], curve?: Curve): [bigint, bigint];
export declare function add(point1: [bigint, bigint], point2: [bigint, bigint], curve?: Curve): [bigint, bigint];
/**
 * Negates a point on the elliptic curve.
 *
 * @param point
 * @param curve
 *
 * @returns
 */
export declare function negate(point: [bigint, bigint], curve?: Curve): [bigint, bigint];
