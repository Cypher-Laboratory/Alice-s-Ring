/**
 * List of supported curves
 */
export declare enum Curve {
    SECP256K1 = "SECP256K1",
    ED25519 = "ED25519",
    CUSTOM = "CUSTOM"
}
export declare const SECP256K1: {
    P: bigint;
    N: bigint;
    Gx: bigint;
    Gy: bigint;
    G: [bigint, bigint];
};
export declare const ED25519: {
    P: bigint;
    N: bigint;
    G: [bigint, bigint];
};
