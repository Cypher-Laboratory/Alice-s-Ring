"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingSignature = void 0;
exports.checkRing = checkRing;
exports.publicKeyToBigInt = publicKeyToBigInt;
exports.bigIntToPublicKey = bigIntToPublicKey;
const ring_sig_utils_1 = require("@cypher-laboratory/ring-sig-utils");
const piSignature_1 = require("./signature/piSignature");
const starknet_utils_1 = require("./starknet-utils");
/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 */
class RingSignature {
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
    constructor(message, ring, c, responses, curve) {
        if (ring.length === 0)
            throw ring_sig_utils_1.errors.noEmptyRing;
        if (ring.length != responses.length)
            throw ring_sig_utils_1.errors.lengthMismatch("ring", "responses");
        if (c >= curve.N)
            throw ring_sig_utils_1.errors.invalidParams("c must be a < N");
        // check ring, c and responses validity
        checkRing(ring, curve);
        for (const response of responses) {
            if (response >= curve.N || response === 0n)
                throw ring_sig_utils_1.errors.invalidResponses;
        }
        this.ring = ring;
        this.message = message;
        this.c = c;
        this.responses = responses;
        this.curve = curve;
    }
    /**
     * Get the Ring
     *
     * @returns The Ring
     */
    getRing() {
        return this.ring;
    }
    /**
     * Get the challenge value
     *
     * @returns The challenge value
     */
    getChallenge() {
        return this.c;
    }
    /**
     * Get the responses
     *
     * @returns The responses
     */
    getResponses() {
        return this.responses;
    }
    /**
     * Get the curve
     *
     * @returns The curve
     */
    getCurve() {
        return this.curve;
    }
    /**
     * Get the message
     *
     * @returns The message
     */
    getMessage() {
        return this.message;
    }
    /**
     * Get the message digest
     *
     * @returns The message digest
     */
    get messageDigest() {
        // Never hash the message with evmCompatibility = true
        return (0, starknet_utils_1.cairoHash)([(0, starknet_utils_1.stringToBigInt)(this.message)]);
    }
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
    static fromJson(json) {
        let parsedJson;
        if (typeof json === "string") {
            try {
                parsedJson = JSON.parse(json);
            }
            catch (e) {
                throw ring_sig_utils_1.errors.invalidJson(e);
            }
        }
        else {
            parsedJson = json;
        }
        // check if message is stored as array or object. If so, throw an error
        if (typeof parsedJson.message !== "string")
            throw ring_sig_utils_1.errors.invalidJson("Message must be a string ");
        // check if c is stored as array or object. If so, throw an error
        if (typeof parsedJson.c !== "string" && typeof parsedJson.c !== "number")
            throw ring_sig_utils_1.errors.invalidJson("c must be a string or a number");
        // if c is a number, convert it to a string
        if (typeof parsedJson.c === "number")
            parsedJson.c = parsedJson.c.toString();
        try {
            const sig = parsedJson;
            const curve = ring_sig_utils_1.Curve.fromString(sig.curve);
            return new RingSignature(sig.message, sig.ring.map((point) => ring_sig_utils_1.Point.deserialize(point)), BigInt("0x" + sig.c), sig.responses.map((response) => BigInt("0x" + response)), curve);
        }
        catch (e) {
            throw ring_sig_utils_1.errors.invalidJson(e);
        }
    }
    /**
     * Create a Json string from a RingSignature
     *
     * @returns A json string
     */
    toJsonString() {
        return JSON.stringify({
            message: this.message,
            ring: (0, ring_sig_utils_1.serializeRing)(this.ring),
            c: this.c.toString(16),
            responses: this.responses.map((response) => response.toString(16)),
            curve: this.curve.toString(),
        });
    }
    /**
     * Transforms a Base64 string to a ring signature
     *
     * @param base64 - The base64 encoded signature
     *
     * @returns The ring signature
     */
    static fromBase64(base64) {
        // check if the base64 string is valid
        if (!ring_sig_utils_1.base64Regex.test(base64))
            throw ring_sig_utils_1.errors.invalidBase64();
        const decoded = Buffer.from(base64, "base64").toString("ascii");
        return RingSignature.fromJson(decoded);
    }
    /**
     * Encode a ring signature to base64 string
     */
    toBase64() {
        return Buffer.from(this.toJsonString()).toString("base64");
    }
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
    static signature(curve, ring, ceePiPlusOne, signerIndex, messageDigest) {
        // check if ring is valid
        try {
            checkRing(ring, curve);
        }
        catch (e) {
            throw ring_sig_utils_1.errors.invalidRing(e);
        }
        // generate random responses for every public key in the ring
        const responses = [];
        for (let i = 0; i < ring.length; i++) {
            responses.push((0, ring_sig_utils_1.randomBigint)(curve.N));
        }
        // contains all the cees from 0 to ring.length - 1 (0, 1, ..., pi, ..., ring.length - 1)
        const cees = ring.map(() => 0n);
        const serializedRing = (0, starknet_utils_1.serializeRingCairo)(ring);
        for (let i = signerIndex + 1; i < ring.length + signerIndex + 1; i++) {
            /*
            Convert i to obtain a numbers between 0 and ring.length - 1,
            starting at pi + 1, going to ring.length and then going from 0 to pi (included)
            */
            const index = i % ring.length;
            const indexMinusOne = index - 1 >= 0n ? index - 1 : index - 1 + ring.length;
            if (index === (signerIndex + 1) % ring.length)
                cees[index] = ceePiPlusOne; // params = { alpha: alpha };
            else {
                const params = {
                    index: index,
                    previousR: responses[indexMinusOne],
                    previousC: cees[indexMinusOne],
                    previousIndex: indexMinusOne,
                };
                // compute the c value
                cees[index] = RingSignature.computeC(ring, serializedRing, messageDigest, params, curve);
            }
        }
        return {
            ring: ring,
            cees: cees,
            signerIndex: signerIndex,
            responses: responses,
        };
    }
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
    static sign(ring, // ring.length = n
    signerPrivateKey, message, curve) {
        if (signerPrivateKey === 0n || signerPrivateKey >= curve.N)
            throw ring_sig_utils_1.errors.invalidParams("Signer private key cannot be 0 and must be < N");
        checkRing(ring, curve, true);
        const messageDigest = (0, starknet_utils_1.cairoHash)([(0, starknet_utils_1.stringToBigInt)(message)]);
        const alpha = (0, ring_sig_utils_1.randomBigint)(curve.N);
        const signerPubKey = (0, ring_sig_utils_1.derivePubKey)(signerPrivateKey, curve);
        if (!(0, ring_sig_utils_1.isRingSorted)(ring))
            throw ring_sig_utils_1.errors.invalidRing("The ring is not sorted");
        let signerIndex = ring.findIndex((point) => point.x === signerPubKey.x && point.y === signerPubKey.y);
        if (signerIndex === -1) {
            ring = ring.concat([signerPubKey]);
            ring = (0, ring_sig_utils_1.sortRing)(ring);
            signerIndex = ring.findIndex((point) => point.x === signerPubKey.x && point.y === signerPubKey.y);
        }
        if (ring.length === 0) {
            ring = [signerPubKey];
            signerIndex = 0;
        }
        const serializedRing = (0, starknet_utils_1.serializeRingCairo)(ring);
        const cpi1 = RingSignature.computeC(ring, serializedRing, messageDigest, { index: (signerIndex + 1) % ring.length, alpha: alpha }, curve);
        const rawSignature = RingSignature.signature(curve, ring, cpi1, signerIndex, messageDigest);
        const signerResponse = (0, piSignature_1.piSignature)(alpha, rawSignature.cees[rawSignature.signerIndex], signerPrivateKey, curve);
        return new RingSignature(message, rawSignature.ring, rawSignature.cees[0], rawSignature.responses
            .slice(0, rawSignature.signerIndex)
            .concat([signerResponse], rawSignature.responses.slice(rawSignature.signerIndex + 1)), curve);
    }
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
    verify() {
        for (const point of this.ring) {
            if (point.checkLowOrder() === false) {
                throw `The public key ${point} is not valid`;
            }
        }
        const messageDigest = (0, starknet_utils_1.cairoHash)([(0, starknet_utils_1.stringToBigInt)(this.message)]);
        const serializedRing = (0, starknet_utils_1.serializeRingCairo)(this.ring);
        // NOTE : the loop has at least one iteration since the ring
        // is ensured to be not empty
        let lastComputedCp = this.c;
        for (let i = 0; i < this.ring.length; i++) {
            lastComputedCp = RingSignature.computeC(this.ring, serializedRing, messageDigest, {
                index: (i + 1) % this.ring.length,
                previousR: this.responses[i],
                previousC: lastComputedCp,
                previousIndex: i,
            }, this.curve);
        }
        return this.c === lastComputedCp;
    }
    /**
     * Verify a RingSignature stored as a base64 string or a json string
     *
     * @param signature - The json or base64 encoded signature to verify
     * @returns True if the signature is valid, false otherwise
     */
    static verify(signature) {
        // check if the signature is a json or a base64 string
        if (ring_sig_utils_1.base64Regex.test(signature)) {
            signature = RingSignature.fromBase64(signature).toJsonString();
        }
        const ringSignature = RingSignature.fromJson(signature);
        return ringSignature.verify();
    }
    /**
     * Verifies a ring signature and computes the msm hint values.
     * @async
     * @returns {Promise<bigint[][]>} - A promise that resolves to a 2D array of bigint values representing
     * @throws {Error} - Throws an error if the signature is invalid or if any public key in the ring is invalid.
     */
    async verify_garaga() {
        for (const point of this.ring) {
            if (point.checkLowOrder() === false) {
                throw `The public key ${point} is not valid`;
            }
        }
        const messageDigest = (0, starknet_utils_1.cairoHash)([(0, starknet_utils_1.stringToBigInt)(this.message)]);
        const serializedRing = (0, starknet_utils_1.serializeRingCairo)(this.ring);
        let lastComputedCp = this.c;
        const hint = [];
        for (let i = 0; i < this.ring.length; i++) {
            const compute = await RingSignature.computeCGaraga(this.ring, serializedRing, messageDigest, {
                index: (i + 1) % this.ring.length,
                previousR: this.responses[i],
                previousC: lastComputedCp,
                previousIndex: i,
            }, this.curve);
            lastComputedCp = compute.last_computed_c;
            hint.push(compute.hint);
        }
        if (this.c === lastComputedCp) {
            return hint;
        }
        else {
            throw Error("Invalid ring signature");
        }
    }
    /**
     * Asynchronously generate the callData and verify the signature
     * @async
     * @returns an object representating the struct for the callData
     * An object containing the instance's message, `c`, `ring`, and `hints` properties.
     * @example
     * const callData = await instance.getCallDataStruct();
     * console.log(callData); // Outputs an object with message, c, ring, and hints
     */
    async getCallData() {
        const hints = await this.verify_garaga();
        const U384Ring = [];
        for (const points of this.ring) {
            const U384Point = points.toU384Coordinates();
            U384Ring.push({ x: U384Point[0], y: U384Point[1] });
        }
        return (0, starknet_utils_1.generateCallData)((0, ring_sig_utils_1.convertToUint384)(this.messageDigest), (0, ring_sig_utils_1.convertToUint384)(this.c), U384Ring, hints);
    }
    static async getCallData(signature) {
        // check if the signature is a json or a base64 string
        if (ring_sig_utils_1.base64Regex.test(signature)) {
            signature = RingSignature.fromBase64(signature).toJsonString();
        }
        const ringSignature = RingSignature.fromJson(signature);
        return await ringSignature.getCallData();
    }
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
    static computeC(ring, serializedRing, messageDigest, params, curve) {
        const G = curve.GtoPoint();
        const N = curve.N;
        const hasAlphaWithoutPrevious = params.alpha &&
            params.previousR === undefined &&
            params.previousC === undefined &&
            params.previousIndex === undefined;
        const hasPreviousWithoutAlpha = !params.alpha &&
            params.previousR !== undefined &&
            params.previousC !== undefined &&
            params.previousIndex !== undefined;
        if (!(hasAlphaWithoutPrevious || hasPreviousWithoutAlpha)) {
            throw ring_sig_utils_1.errors.missingParams("Either 'alpha' or all the others params must be set");
        }
        if (params.alpha) {
            const alphaG = G.mult(params.alpha);
            let pointToUse;
            if (curve.name === ring_sig_utils_1.CurveName.ED25519) {
                pointToUse = (0, starknet_utils_1.pointToWeirstrass)(alphaG);
            }
            else {
                pointToUse = alphaG.toCoordinates();
            }
            const message_to_hash = (0, ring_sig_utils_1.uint384Serialize)((0, ring_sig_utils_1.convertToUint384)(messageDigest));
            const hashContent = serializedRing
                .concat(message_to_hash)
                .concat((0, ring_sig_utils_1.uint384Serialize)((0, ring_sig_utils_1.convertToUint384)(pointToUse[1])));
            return (0, ring_sig_utils_1.mod)((0, starknet_utils_1.cairoHash)(hashContent), N);
        }
        if (params.previousR &&
            params.previousC &&
            params.previousIndex !== undefined) {
            const computedPoint = G.mult(params.previousR).add(ring[params.previousIndex].mult(params.previousC));
            //handle the conversion to weirstrass form if curve == ED25519
            let pointToUse;
            if (curve.name === ring_sig_utils_1.CurveName.ED25519) {
                pointToUse = (0, starknet_utils_1.pointToWeirstrass)(computedPoint);
            }
            else {
                pointToUse = computedPoint.toCoordinates();
            }
            const message_to_hash = (0, ring_sig_utils_1.uint384Serialize)((0, ring_sig_utils_1.convertToUint384)(messageDigest));
            const hashContent = serializedRing
                .concat(message_to_hash)
                .concat((0, ring_sig_utils_1.uint384Serialize)((0, ring_sig_utils_1.convertToUint384)(pointToUse[1])));
            return (0, ring_sig_utils_1.mod)((0, starknet_utils_1.cairoHash)(hashContent), N);
        }
        throw ring_sig_utils_1.errors.missingParams("Either 'alpha' or all the others params must be set");
    }
    static async computeCGaraga(ring, serializedRing, messageDigest, params, curve) {
        const G = curve.GtoPoint();
        const N = curve.N;
        if (params.previousR &&
            params.previousC &&
            params.previousIndex !== undefined) {
            const computedPoint = G.mult(params.previousR).add(ring[params.previousIndex].mult(params.previousC));
            //handle the conversion to weirstrass form if curve == ED25519
            let pointToUse;
            if (curve.name === ring_sig_utils_1.CurveName.ED25519) {
                pointToUse = (0, starknet_utils_1.pointToWeirstrass)(computedPoint);
            }
            else {
                pointToUse = computedPoint.toCoordinates();
            }
            const precompute = await (0, starknet_utils_1.prepareGaragaHints)([G, ring[params.previousIndex]], [params.previousR, params.previousC]);
            const message_to_hash = (0, ring_sig_utils_1.uint384Serialize)((0, ring_sig_utils_1.convertToUint384)(messageDigest));
            const hashContent = serializedRing
                .concat(message_to_hash)
                .concat((0, ring_sig_utils_1.uint384Serialize)((0, ring_sig_utils_1.convertToUint384)(pointToUse[1])));
            return {
                last_computed_c: (0, ring_sig_utils_1.mod)((0, starknet_utils_1.cairoHash)(hashContent), N),
                hint: precompute,
            };
        }
        throw ring_sig_utils_1.errors.missingParams("Either 'alpha' or all the others params must be set");
    }
}
exports.RingSignature = RingSignature;
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
function checkRing(ring, ref, emptyRing = false) {
    // check if the ring is empty
    if (ring.length === 0 && !emptyRing)
        throw ring_sig_utils_1.errors.noEmptyRing;
    if (!ref)
        ref = ring[0].curve;
    // check for duplicates using a set
    if (new Set((0, ring_sig_utils_1.serializeRing)(ring)).size !== ring.length)
        throw ring_sig_utils_1.errors.noDuplicates("ring");
    // check if all the points are valid
    try {
        for (const point of ring) {
            (0, ring_sig_utils_1.checkPoint)(point, ref);
        }
    }
    catch (e) {
        throw ring_sig_utils_1.errors.invalidPoint(("At least one point is not valid: " + e));
    }
}
function publicKeyToBigInt(publicKeyHex) {
    // Ensure the key is stripped of the prefix and is valid
    if (!publicKeyHex.startsWith("02") &&
        !publicKeyHex.startsWith("03") &&
        !publicKeyHex.startsWith("ED02") &&
        !publicKeyHex.startsWith("ED03")) {
        throw new Error("Invalid compressed public key");
    }
    let ed = false;
    if (publicKeyHex.startsWith("ED02") || publicKeyHex.startsWith("ED03")) {
        publicKeyHex = publicKeyHex.slice(2);
        ed = true;
    }
    // Remove the prefix (0x02 or 0x03) and convert the remaining hex to BigInt
    const bigint = BigInt("0x" + publicKeyHex.slice(2));
    // add an extra 1 if the y coordinate is odd and 2 if it is even
    if (publicKeyHex.startsWith("03")) {
        return BigInt(bigint.toString() + "1" + (ed ? "3" : ""));
    }
    else {
        return BigInt(bigint.toString() + "2" + (ed ? "3" : ""));
    }
}
function bigIntToPublicKey(bigint) {
    let ed = false;
    if (bigint.toString().endsWith("3")) {
        bigint = BigInt(bigint.toString().slice(0, -1));
        ed = true;
    }
    const parity = bigint.toString().slice(-1);
    const prefix = parity === "1" ? "03" : "02";
    bigint = BigInt(bigint.toString().slice(0, -1));
    let hex = bigint.toString(16);
    hex = hex.padStart(64, "0"); // Pad to ensure the hex is 64 characters long
    if (ed) {
        return "ED" + prefix + hex;
    }
    else {
        return prefix + hex;
    }
}
