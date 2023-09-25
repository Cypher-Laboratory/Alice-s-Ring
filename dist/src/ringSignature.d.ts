import { Curve, Point } from "./utils";
/**
 * Ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see cees - The first c value
 * @see responses - Responses for each public key in the ring
 */
export interface RingSig {
    message: string;
    ring: Point[];
    c: bigint;
    responses: bigint[];
    curve: Curve;
}
/**
 * Partial ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see pi - The signer index -> should be kept secret
 * @see c - The first c computed during the first part of the signing
 * @see cpi - The c value of the signer
 * @see alpha - The alpha value
 * @see responses - The generated responses
 * @see curve - The elliptic curve to use
 */
export interface PartialSignature {
    message: string;
    ring: Point[];
    pi: number;
    c: bigint;
    cpi: bigint;
    alpha: bigint;
    responses: bigint[];
    curve: Curve;
}
/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 *
 * @remarks
 * For know, only SECP256K1 curve is fully supported.
 * ED25519 is on its way and then we would be able to sign using both curves at the same time
 */
export declare class RingSignature {
    message: string;
    c: bigint;
    responses: bigint[];
    ring: Point[];
    curve: Curve;
    /**
     * Ring signature class constructor
     *
     * @param message - Clear message to sign
     * @param ring - Ring of public keys
     * @param cees - c values
     * @param responses - Responses for each public key in the ring
     * @param curve - Curve used for the signature
     */
    constructor(message: string, ring: Point[], c: bigint, responses: bigint[], curve: Curve);
    /**
     * Create a RingSignature from a RingSig
     *
     * @param sig - The RingSig to convert
     *
     * @returns A RingSignature
     */
    static fromRingSig(sig: RingSig): RingSignature;
    /**
     * Transform a RingSignature into a RingSig
     *
     * @returns A RingSig
     */
    toRingSig(): RingSig;
    /**
     * Transforms a Base64 string to a ring signature
     *
     * @param base64 - The base64 encoded signature
     *
     * @returns The ring signature
     */
    static fromBase64(base64: string): RingSignature;
    /**
     * Encode a ring signature to base64 string
     */
    toBase64(): string;
    /**
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys (does not contain the signer public key)
     * @param signerPrivKey - Private key of the signer
     * @param message - Clear message to sign
     * @param curve - The elliptic curve to use
     *
     * @returns A RingSignature
     */
    static sign(ring: Point[], // ring.length = n
    signerPrivateKey: bigint, message: string, curve?: Curve): RingSignature;
    /**
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys (does not contain the signer public key)
     * @param message - Clear message to sign
     * @param signerPubKey - Public key of the signer
     *
     * @returns A PartialSignature
     */
    static partialSign(ring: Point[], // ring.length = n
    message: string, signerPubKey: Point, curve?: Curve): PartialSignature;
    /**
     * Combine partial signatures into a RingSignature
     *
     * @param partialSig - Partial signatures to combine
     * @param signerResponse - Response of the signer
     *
     * @returns A RingSignature
     */
    static combine(partialSig: PartialSignature, signerResponse: bigint): RingSignature;
    /**
     * Verify a RingSignature
     *
     * @returns True if the signature is valid, false otherwise
     */
    verify(): boolean;
    /**
     * Verify a RingSignature stored as a RingSig
     *
     * @param signature - The RingSig to verify
     * @returns True if the signature is valid, false otherwise
     */
    static verify(signature: RingSig): boolean;
    /**
     * Generate an incomplete ring signature
     *
     * @param curve - The curve to use
     * @param ring - The ring of public keys
     * @param signerKey - The signer private or public key
     * @param message - The message to sign
     * @returns An incomplete ring signature
     */
    private static signature;
    private static computeC;
}
