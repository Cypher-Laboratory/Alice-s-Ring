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
    constructor(curve: CurveName, params?: {
        P: bigint;
        G: [bigint, bigint];
        N: bigint;
    });
    GtoPoint(): Point;
    toString(): string;
    static fromString(curveData: string): Curve;
}
