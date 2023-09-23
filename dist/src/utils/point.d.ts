import { Curve } from "./curves";
/**
 * A point on the elliptic curve.
 */
export declare class Point {
    curve: Curve;
    x: bigint;
    y: bigint;
    constructor(curve: Curve, coordinates: [bigint, bigint]);
    /**
     * Multiplies a scalar by a point on the elliptic curve.
     *
     * @param scalar - the scalar to multiply
     * @param point - the point to multiply
     * @returns the result of the multiplication
     */
    mult(scalar: bigint): Point;
    add(point: Point, curve?: Curve): Point;
    /**
     * Negates a point on the elliptic curve.
     *
     * @param point
     * @param curve
     *
     * @returns
     */
    negate(): Point;
    modulo(p: bigint): Point;
    toBigintArray(): [bigint, bigint];
    toString(): string;
}
