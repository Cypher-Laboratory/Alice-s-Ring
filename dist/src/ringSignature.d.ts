import { Curve, Point } from "./utils";
import { Config } from "./utils/curves";
/**
 * Signature config interface
 *
 * @see derivationConfig - The config to use for the key derivation
 * @see evmCompatibility - If true, the signature will be compatible with our EVM verifier contract
 * @see safeMode - If true, check if all the points are on the same curve
 */
export interface SignatureConfig {
    derivationConfig?: Config;
    evmCompatibility?: boolean;
    safeMode?: boolean;
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
    config?: SignatureConfig;
}
/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 */
export declare class RingSignature {
    message: string;
    c: bigint;
    responses: bigint[];
    ring: Point[];
    curve: Curve;
    config?: SignatureConfig;
    /**
     * Ring signature class constructor
     *
     * @param message - Clear message to sign
     * @param ring - Ring of public keys
     * @param cees - c values
     * @param responses - Responses for each public key in the ring
     * @param curve - Curve used for the signature
     * @param safeMode - If true, check if all the points are on the same curve
     */
    constructor(message: string, ring: Point[], c: bigint, responses: bigint[], curve: Curve, config?: SignatureConfig);
    /**
     * Create a RingSignature from a json object
     *
     * @param json - The json to convert
     *
     * @returns A RingSignature
     */
    static fromJsonString(json: string): RingSignature;
    /**
     * Create a Json string from a RingSignature
     *
     * @returns A json string
     */
    toJsonString(): string;
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
     * @param config - The config params to use
     *
     * @returns A RingSignature
     */
    static sign(ring: Point[], // ring.length = n
    signerPrivateKey: bigint, message: string, curve: Curve, config?: SignatureConfig): RingSignature;
    /**
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys (does not contain the signer public key)
     * @param message - Clear message to sign
     * @param signerPubKey - Public key of the signer
     * @param config - The config params to use
     *
     * @returns A PartialSignature
     */
    static partialSign(ring: Point[], // ring.length = n
    message: string, signerPubKey: Point, curve: Curve, config?: SignatureConfig): PartialSignature;
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
     * Verify a RingSignature stored as a json string
     *
     * @param signature - The json signature to verify
     * @returns True if the signature is valid, false otherwise
     */
    static verify(signature: string): boolean;
    /**
     * Generate an incomplete ring signature.
     * Allow the user to use its private key from an external software (external software/hardware wallet)
     *
     * @param curve - The curve to use
     * @param ring - The ring of public keys
     * @param signerKey - The signer private or public key
     * @param message - The message to sign
     * @param config - The config params to use
     *
     * @returns An incomplete ring signature
     */
    private static signature;
    /** // TODO: update doc according to function signature
     * Compute a c value
     *
     * @remarks
     * This function is used to compute the c value of a partial signature.
     * Either 'alpha' or all the other parameters of 'params' must be set.
     *
     * @param ring - Ring of public keys
     * @param message - Message digest
     * @param G - Curve generator point
     * @param N - Curve order
     * @param r - The response which will be used to compute the c value
     * @param previousC - The previous c value
     * @param previousPubKey - The previous public key
     * @param config - The config params to use
     * @param piPlus1 - If set, the c value will be computed as if it was the pi+1 signer
     *
     * @returns A c value
     */
    private static computeC;
    /**
     * Convert a partial signature to a base64 string
     *
     * @param partialSig - The partial signature to convert
     * @returns A base64 string
     */
    static partialSigToBase64(partialSig: PartialSignature): string;
    /**
     * Convert a base64 string to a partial signature
     *
     * @param base64 - The base64 string to convert
     * @returns A partial signature
     */
    static base64ToPartialSig(base64: string): PartialSignature;
}
