/**
 * Ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see cees - c values
 * @see responses - Responses for each public key in the ring
 */
export interface RingSig {
    message: string;
    ring: [[bigint, bigint]];
    cees: bigint[];
    responses: bigint[];
}
/**
 * Partial ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see cees - c values
 * @see fakeResponses_0_pi - Fake responses from 0 to pi-1
 * @see fakeResponses_pi_n - Fake responses from pi+1 to n
 */
export interface PartialSignature {
    message: string;
    ring: [[bigint, bigint]];
    cees: bigint[];
    fakeResponses_0_pi: bigint[];
    fakeResponses_pi_n: bigint[];
}
export declare class RingSignature {
    message: string;
    cees: bigint[];
    responses: bigint[];
    ring: [[bigint, bigint]];
    /**
     * Ring signature class constructor
     *
     * @param message - Clear message to sign
     * @param ring - Ring of public keys
     * @param cees - c values
     * @param responses - Responses for each public key in the ring
     */
    constructor(message: string, ring: [[bigint, bigint]], cees: bigint[], responses: bigint[]);
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
     * @param ring - Ring of public keys
     * @param signerPrivKey - Private key of the signer
     * @param message - Clear message to sign
     *
     * @returns A RingSignature
     */
    static sign(ring: [[bigint, bigint]], // ring.length = n
    signerPrivKey: bigint, message: string): RingSignature;
    /**
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys
     * @param message - Clear message to sign
     *
     * @returns A PartialSignature
     */
    static partialSign(ring: [[bigint, bigint]], // ring.length = n
    message: string): PartialSignature;
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
}
