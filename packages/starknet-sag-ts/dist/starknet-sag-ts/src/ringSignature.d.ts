import { Curve, Point } from "@cypher-laboratory/ring-sig-utils";
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
    /**
     * Ring signature class constructor
     *
     * @param message - Clear message to sign
     * @param ring - Ring of public keys
     * @param c - c value
     * @param responses - Responses for each public key in the ring
     * @param curve - Curve used for the signature
     * @param config - The config params to use (optional)
     */
    constructor(message: string, ring: Point[], c: bigint, responses: bigint[], curve: Curve);
    /**
     * Get the Ring
     *
     * @returns The Ring
     */
    getRing(): Point[];
    /**
     * Get the challenge value
     *
     * @returns The challenge value
     */
    getChallenge(): bigint;
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
     * Get the message
     *
     * @returns The message
     */
    getMessage(): string;
    /**
     * Get the message digest
     *
     * @returns The message digest
     */
    get messageDigest(): bigint;
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
    static fromJson(json: string | object): RingSignature;
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
     * Generate an incomplete ring signature.
     *
     * @param curve - The curve to use
     * @param ring - The ring of public keys
     * @param ceePiPlusOne - The Cpi+1 value
     * @param signerIndex - The signer index in the ring
     * @param messageDigest - The message digest
     * @param config - The config params to use
     *
     * @returns An incomplete ring signature
     */
    private static signature;
    /**
     * Generates a ring signature for a given message using the provided ring of public keys,
     * the signer's private key, and the elliptic curve parameters.
     * @async
     * @param {Point[]} ring - The array of public keys representing the participants in the ring signature.
     * @param {bigint} signerPrivateKey - The private key of the signer, which must be a bigint less than the curve's order (N).
     * @param {string} message - The message to be signed, which is hashed as part of the signature process.
     * @param {Curve} curve - The elliptic curve parameters used for the cryptographic operations.
     * @returns {Promise<CairoRingSignature>} - A promise that resolves to a valid CairoRingSignature containing the ring, message, and signature data.
     * @throws {Error} - Throws an error if the private key is invalid, the ring is not sorted, or other validation checks fail.
     * @example
     * const ringSignature = await MyClass.sign(ring, privateKey, "message to sign", curve);
     * console.log(ringSignature); // Outputs the CairoRingSignature object
     */
    static sign(ring: Point[], // ring.length = n
    signerPrivateKey: bigint, message: string, curve: Curve): RingSignature;
    /**
     * Verify a RingSignature
     *
     * @remarks
     * if ring.length = 1, the signature is a schnorr signature. It can be verified by this method or using 'verifySchnorrSignature' function.
     * To do so, call 'verifySchnorrSignature' with the following parameters:
     * - messageDigest: the message digest
     * - signerPubKey: the public key of the signer
     * - signature: the signature { c, r }
     * - curve: the curve used for the signature
     * - config: the config params used for the signature (can be undefined)
     * - keyPrefixing: true
     *
     * @returns True if the signature is valid, false otherwise
     */
    verify(): boolean;
    /**
     * Verify a RingSignature stored as a base64 string or a json string
     *
     * @param signature - The json or base64 encoded signature to verify
     * @returns True if the signature is valid, false otherwise
     */
    static verify(signature: string): boolean;
    /**
     * Verifies a ring signature and computes the msm hint values.
     * @async
     * @returns {Promise<bigint[][]>} - A promise that resolves to a 2D array of bigint values representing
     * @throws {Error} - Throws an error if the signature is invalid or if any public key in the ring is invalid.
     */
    private verify_garaga;
    /**
     * Asynchronously generate the callData and verify the signature
     * @async
     * @returns an object representating the struct for the callData
     * An object containing the instance's message, `c`, `ring`, and `hints` properties.
     * @example
     * const callData = await instance.getCallDataStruct();
     * console.log(callData); // Outputs an object with message, c, ring, and hints
     */
    getCallData(): Promise<bigint[]>;
    static getCallData(signature: string): Promise<bigint[]>;
    /**
     * Compute a challenge (abbriviated c) value
     *
     * @remarks
     * Either 'alpha' or all the other keys of 'params' must be set.
     *
     * @param ring - Ring of public keys
     * @param message - Message digest
     * @param G - Curve generator point
     * @param N - Curve order
     * @param params - The params to use
     * @param config - The config params to use
     *
     * @see params.index - The index of the public key in the ring
     * @see params.previousR - The previous response which will be used to compute the new c value
     * @see params.previousC - The previous c value which will be used to compute the new c value
     * @see params.previousPubKey - The previous public key which will be used to compute the new c value
     * @see params.alpha - The alpha value which will be used to compute the new c value
     *
     * @returns A new c value
     */
    private static computeC;
    private static computeCGaraga;
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
export declare function publicKeyToBigInt(publicKeyHex: string): bigint;
export declare function bigIntToPublicKey(bigint: bigint): string;
