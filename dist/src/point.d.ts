import { Curve } from "./curves";
/**
 * A point on the elliptic curve.
 */
export declare class Point {
    curve: Curve;
    x: bigint;
    y: bigint;
    /**
     * Creates a point instance.
     *
     * @param curve - The curve
     * @param coordinates - The point coordinates ([x,y])
     * @param generator - if true, the point is a generator point
     * @param safeMode - if true, the point is checked to be on the curve
     *
     * @throws if the point is not on the curve
     *
     * @returns the point
     */
    constructor(curve: Curve, coordinates: [bigint, bigint], safeMode?: boolean);
    /**
     * Multiplies a scalar by a point on the elliptic curve.
     *
     * @param scalar - the scalar to multiply
     * @param point - the point to multiply
     * @returns the result of the multiplication
     */
    mult(scalar: bigint): Point;
    /**
     * Adds two points on the elliptic curve.
     *
     * @param point - the point to add
     * @returns the result of the addition as a new Point
     */
    add(point: Point): Point;
    /**
     * Checks if two points are equal.
     *
     * @param point - the point to compare to
     * @returns true if the points are equal, false otherwise
     */
    equals(point: Point): boolean;
    /**
     * Negates a point on the elliptic curve.
     *
     * @param point - the point to negate
     *
     * @returns the negated point
     */
    negate(): Point;
    /**
     * Converts a point to its affine representation.
     *
     * @returns the affine representation of the point
     */
    toAffine(): [bigint, bigint];
    /**
     * Converts a point to its json string representation.
     *
     * @returns the json string representation of the point
     */
    toString(): string;
    /**
     * Converts a json string to a point.
     *
     * @param string - the json string representation of the point
     * @returns the point
     */
    static fromString(string: string): Point;
    /**
     * Converts a point to its base64 string representation.
     */
    toBase64(): string;
    /**
     * Converts a base64 string to a point.
     *
     * @param base64 - the base64 string representation of the point
     * @returns the point
     */
    static fromBase64(base64: string): Point;
    /**
     * Converts a hex public key (XRPL standard) to a Point object.
     *
     * @param hex the hex string representation of the public key XRPL Format
     * @returns the point
     *
     */
    static fromHexXRPL(hex: string): Point;
    isValid(): boolean;
}
