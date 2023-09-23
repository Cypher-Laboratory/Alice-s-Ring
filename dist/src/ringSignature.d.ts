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
    responses: Point[];
    curve: Curve;
}
/**
 * Partial ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see cees - c values
 * @see responses_0_pi - Fake responses from 0 to pi-1
 * @see responses_pi_n - Fake responses from pi+1 to n
 */
export interface PartialSignature {
    message: string;
    ring: Point[];
    cees: bigint[];
    alpha: bigint;
    signerIndex: number;
    responses_0_pi: Point[];
    responses_pi_n: Point[];
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
    responses: Point[];
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
    constructor(message: string, ring: Point[], c: bigint, responses: Point[], curve: Curve);
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
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys (does not contain the signer public key)
     * @param signerPrivKey - Private key of the signer
     * @param message - Clear message to sign
     *
     * @returns A RingSignature
     */
    static sign(ring: Point[], // ring.length = n
    signerPrivKey: bigint, message: string, curve?: Curve): RingSignature;
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
    static combine(partialSig: PartialSignature, signerResponse: Point): RingSignature;
    /**
     * Verify a RingSignature
     *
     * @returns True if the signature is valid, false otherwise
     */
    verify(): boolean;
    static verify(signature: RingSig): boolean;
}
