import { Curve } from "./curves";
/**
 * A point on the elliptic curve.
 */
export declare class Point {
    curve: Curve;
    x: bigint;
    y: bigint;
    /**
     *
     *
     * @param curve - The curve
     * @param coordinates - The point coordinates ([x,y])
     * @param generator - if true, the point is a generator point
     */
    constructor(curve: Curve, coordinates: [bigint, bigint]);
    /**
     * Multiplies a scalar by a point on the elliptic curve.
     *
     * @param scalar - the scalar to multiply
     * @param point - the point to multiply
     * @returns the result of the multiplication
     */
    mult(scalar: bigint): Point;
    add(point: Point): Point;
    equals(point: Point): boolean;
    /**
     * Negates a point on the elliptic curve.
     *
     * @param point - the point to negate
     *
     * @returns the negated point
     */
    negate(): Point;
    toAffine(): [bigint, bigint];
    toString(): string;
    static fromString(string: string): Point;
    toBase64(): string;
    static fromBase64(base64: string): Point;
}
