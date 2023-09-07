export interface RingSig {
    message: string;
    ring: [[bigint, bigint]];
    cees: bigint[];
    responses: bigint[];
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
     * Verify a RingSignature
     *
     * @returns True if the signature is valid, false otherwise
     */
    verify(): boolean;
}
