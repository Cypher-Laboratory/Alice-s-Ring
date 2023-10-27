import { Point } from "./point";
/**
 * List of supported curves
 */
export declare enum CurveName {
    SECP256K1 = "SECP256K1",
    ED25519 = "ED25519",
    CUSTOM = "CUSTOM"
}
export declare class Curve {
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
 * List of supported configs for the `derivePubKey` function
 * This configs are used to specify if a specific way to derive the public key is used. (such as for xrpl keys)
 */
export declare enum Config {
    DEFAULT = "DEFAULT",
    XRPL = "XRPL"
}
/**
 * Derive the public key from the private key.
 *
 * @param privateKey - the private key
 * @param curve - the curve to use
 * @param config - the config to use (optional)
 * @returns
 */
export declare function derivePubKey(privateKey: bigint, curve: Curve, config?: Config): Point;
