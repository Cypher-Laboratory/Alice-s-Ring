import { Point } from "@cypher-laboratory/ring-sig-utils";
/**
 * Converts a point from Twisted Edwards to Weierstrass coordinates
 * @param a_twisted The 'a' parameter of the Twisted Edwards curve
 * @param d_twisted The 'd' parameter of the Twisted Edwards curve
 * @param p The prime modulus
 * @param x_twisted The x-coordinate in Twisted Edwards form
 * @param y_twisted The y-coordinate in Twisted Edwards form
 * @returns A tuple [x, y] representing the point in Weierstrass coordinates
 */
export declare function toWeierstrass(a_twisted: bigint, d_twisted: bigint, p: bigint, x_twisted: bigint, y_twisted: bigint): [bigint, bigint];
/**
 * Converts a point from Weierstrass to Twisted Edwards coordinates
 * @param a_twisted The 'a' parameter of the Twisted Edwards curve
 * @param d_twisted The 'd' parameter of the Twisted Edwards curve
 * @param p The prime modulus
 * @param x_twisted The x-coordinate in Weirstrass form
 * @param y_twisted The y-coordinate in Weirstrass form
 * @returns A tuple [x, y] representing the point in Weierstrass coordinates
 */
export declare function toTwistedEdwards(a_twisted: bigint, d_twisted: bigint, p: bigint, x_weierstrass: bigint, y_weierstrass: bigint): [bigint, bigint];
/**
 * Converts a point from Twisted Edwards to Weierstrass coordinates.
 *
 * This function serves as a wrapper around the `toWeierstrass` function,
 * specifically designed to work with the Point class. It currently supports
 * only the ED25519 curve.
 *
 * @param p The Point object to convert, must be on a supported curve.
 * @returns A tuple [x, y] representing the point in Weierstrass coordinates.
 * @throws Will throw an Error if the curve is not supported.
 */
export declare function pointToWeirstrass(p: Point): [bigint, bigint];
/**
 * Computes and returns the MSM (Multi-Scalar Multiplication) hint for a given set of points and scalars.
 * This function uses the Garaga library to generate a hint for efficient MSM computation.
 *
 * @param points An array of points.
 * @param scalars An array of bigint scalars corresponding to the point multiplier.
 * @returns A Promise that resolves to a bigint array containing the MSM hint.
 * @throws Will throw an error if the Garaga library fails to initialize or if the MSM calldata building fails.
 */
export declare function prepareGaragaHints(points: Point[], scalars: bigint[]): Promise<bigint[]>;
