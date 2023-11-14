/**
 * A point on the elliptic curve.
 */
declare class Point {
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
}
/**
 * List of supported curves
 */
declare enum CurveName {
    SECP256K1 = "SECP256K1",
    ED25519 = "ED25519"
}
declare class Curve {
    name: CurveName;
    N: bigint;
    G: [bigint, bigint];
    P: bigint;
    /**
     * Creates a curve instance.
     *
     * @param curve - The curve name
     * @param params - The curve parameters (optional if curve is SECP256K1 or ED25519)
     */
    constructor(curve: CurveName, params?: {
        P: bigint;
        G: [bigint, bigint];
        N: bigint;
    });
    /**
     * Returns the generator point as a Point instance.
     *
     * @returns the generator point
     */
    GtoPoint(): Point;
    /**
     * Returns the curve as a json string.
     */
    toString(): string;
    /**
     * Returns a curve instance from a json string.
     *
     * @param curveData - the curve as a json string
     * @returns the curve instance
     */
    static fromString(curveData: string): Curve;
}
/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 * It is really close to a schnorr signature.
 *
 * @param nonce - the nonce to use
 * @param message - the message to sign
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
export declare function piSignature(nonce: bigint, // = alpha in our ring signature scheme
message: bigint, // = c in our ring signature scheme
signerPrivKey: bigint, curve: Curve): bigint;
export {};
