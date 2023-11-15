import { Curve, PartialSignature, Point } from ".";
import { SignatureConfig } from "./interfaces";
/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 */
export declare class RingSignature {
    private message;
    private c;
    private responses;
    private ring;
    private curve;
    private config?;
    private hash;
    /**
     * Ring signature class constructor
     *
     * @param message - Clear message to sign
     * @param ring - Ring of public keys
     * @param cees - c values
     * @param responses - Responses for each public key in the ring
     * @param curve - Curve used for the signature
     * @param safeMode - If true, check if all the points are on the same curve
     * @param config - The config params to use (optional)
     */
    constructor(message: string, ring: Point[], c: bigint, responses: bigint[], curve: Curve, config?: SignatureConfig);
    /**
     * Get the message
     *
     * @returns The message
     */
    getRing(): Point[];
    /**
     * Get the seed value
     *
     * @returns The seed value
     */
    getC(): bigint;
    /**
     * Get the responses
     *
     * @returns The responses
     */
    getResponses(): bigint[];
    /**
     * Get the curve
     *
     * @returns The curve
     */
    getCurve(): Curve;
    /**
     * Get the config
     *
     * @returns The config
     */
    getConfig(): SignatureConfig | undefined;
    /**
     * Get the message
     *
     * @returns The message
     */
    getMessage(): string;
    /**
     * Create a RingSignature from a json object
     *
     * @remarks
     * message can be stored in the json as string or number. Not array or object
     *
     * @param json - The json to convert
     *
     * @returns A RingSignature
     */
    static fromJsonString(json: string | object): RingSignature;
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
    /**
     * Compute a c value
     *
     * @remarks
     * This function is used to compute the c value of a partial signature.
     * Either 'alpha' or all the other keys of 'params' must be set.
     *
     * @param ring - Ring of public keys
     * @param message - Message digest
     * @param G - Curve generator point
     * @param N - Curve order
     * @param params - The params to use
     * @param config - The config params to use
     *
     * @see params.previousR - The previous response which will be used to compute the new c value
     * @see params.previousC - The previous c value which will be used to compute the new c value
     * @see params.previousPubKey - The previous public key which will be used to compute the new c value
     * @see params.alpha - The alpha value which will be used to compute the new c value
     *
     * @returns A new c value
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
/**
 * Check if a ring is valid
 *
 * @param ring - The ring to check
 * @param ref - The curve to use as a reference (optional, if not set, the first point's curve will be used)
 * @param emptyRing - If true, the ring can be empty
 *
 * @throws Error if the ring is empty
 * @throws Error if the ring contains duplicates
 * @throws Error if at least one of the points is invalid
 */
export declare function checkRing(ring: Point[], ref?: Curve, emptyRing?: boolean): void;
/**
 * Check if a point is valid
 *
 * @param point - The point to check
 * @param curve - The curve to use as a reference
 *
 * @throws Error if the point is not on the reference curve
 * @throws Error if at least 1 coordinate is not valid (= 0 or >= curve order)
 */
export declare function checkPoint(point: Point, curve?: Curve): void;
export { SignatureConfig };
