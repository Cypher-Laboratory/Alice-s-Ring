/**
 * List of supported curves
 */
export declare enum Curve {
    SECP256K1 = "SECP256K1",
    ED25519 = "ED25519"
}
export declare const SECP256K1: {
    P: bigint;
    Gx: bigint;
    Gy: bigint;
    G: [bigint, bigint];
};
