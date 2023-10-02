"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingSignature = void 0;
const js_sha3_1 = require("js-sha3");
const utils_1 = require("./utils");
const piSignature_1 = require("./signature/piSignature");
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
     * @param cees - c values
     * @param responses - Responses for each public key in the ring
     * @param curve - Curve used for the signature
     * @param safeMode - If true, check if all the points are on the same curve
     */
    constructor(message, ring, c, responses, curve, safeMode = false) {
        if (ring.length != responses.length)
            throw new Error("Ring and responses length mismatch");
        if (safeMode) {
            for (const i of ring) {
                if (i.curve.name != curve.name) {
                    throw new Error("Point not on curve");
                }
            }
        }
        this.ring = ring;
        this.message = message;
        this.c = c;
        this.responses = responses;
        this.curve = curve;
    }
    /**
     * Create a RingSignature from a json object
     *
     * @param json - The json to convert
     *
     * @returns A RingSignature
     */
    static fromJsonString(json) {
        try {
            const sig = JSON.parse(json);
            return new RingSignature(sig.message, sig.ring.map((point) => utils_1.Point.fromString(point)), BigInt(sig.c), sig.responses.map((response) => BigInt(response)), utils_1.Curve.fromString(sig.curve));
        }
        catch (e) {
            throw new Error("Invalid json: " + e);
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
            ring: this.ring.map((point) => point.toString()),
            c: this.c.toString(),
            responses: this.responses.map((response) => response.toString()),
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
        const decoded = Buffer.from(base64, "base64").toString("ascii");
        const json = JSON.parse(decoded);
        const ring = json.ring.map((point) => utils_1.Point.fromString(point));
        return new RingSignature(json.message, ring, BigInt(json.c), json.responses.map((response) => BigInt(response)), utils_1.Curve.fromString(json.curve));
    }
    /**
     * Encode a ring signature to base64 string
     */
    toBase64() {
        return Buffer.from(this.toJsonString()).toString("base64");
    }
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
    static sign(ring, // ring.length = n
    signerPrivateKey, message, curve) {
        const G = curve.GtoPoint(); // generator point
        if (ring.length === 0) {
            /*
             * If the ring is empty, we just sign the message using our schnorr-like signature scheme
             * and return a ring signature with only one response.
             * Note that alpha is computed from c to allow verification.
             */
            const c = (0, utils_1.randomBigint)(curve.N);
            const alpha = (0, utils_1.modulo)(2n * c + 1n, curve.N);
            const sig = (0, piSignature_1.piSignature)(alpha, c, signerPrivateKey, curve);
            return new RingSignature(message, [G.mult(signerPrivateKey)], c, [sig], curve);
        }
        const rawSignature = RingSignature.signature(curve, ring, signerPrivateKey, message);
        // compute the signer response
        const signerResponse = (0, piSignature_1.piSignature)(rawSignature.alpha, rawSignature.cees[rawSignature.pi], signerPrivateKey, curve);
        return new RingSignature(message, rawSignature.ring, rawSignature.cees[0], 
        // insert the signer response
        rawSignature.responses
            .slice(0, rawSignature.pi)
            .concat([signerResponse], rawSignature.responses.slice(rawSignature.pi + 1)), curve);
    }
    /**
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys (does not contain the signer public key)
     * @param message - Clear message to sign
     * @param signerPubKey - Public key of the signer
     *
     * @returns A PartialSignature
     */
    static partialSign(ring, // ring.length = n
    message, signerPubKey, curve) {
        if (ring.length === 0)
            throw new Error("To proceed partial signing, ring length must be greater than 0");
        const rawSignature = RingSignature.signature(curve, ring, signerPubKey, message);
        return {
            message,
            ring: rawSignature.ring,
            c: rawSignature.cees[0],
            cpi: rawSignature.cees[rawSignature.pi],
            responses: rawSignature.responses,
            pi: rawSignature.pi,
            alpha: rawSignature.alpha,
            curve: curve,
        };
    }
    /**
     * Combine partial signatures into a RingSignature
     *
     * @param partialSig - Partial signatures to combine
     * @param signerResponse - Response of the signer
     *
     * @returns A RingSignature
     */
    static combine(partialSig, signerResponse) {
        return new RingSignature(partialSig.message, partialSig.ring, partialSig.c, 
        // insert the signer response
        partialSig.responses
            .slice(0, partialSig.pi)
            .concat([signerResponse], partialSig.responses.slice(partialSig.pi + 1)), partialSig.curve);
    }
    /**
     * Verify a RingSignature
     *
     * @returns True if the signature is valid, false otherwise
     */
    verify() {
        // we compute c1' = Hash(Ring, m, [r0G, c0K0])
        // then, for each ci (1 < i < n), compute ci' = Hash(Ring, message, [riG + ciKi])
        // (G = generator, K = ring public key)
        // finally, if we substitute lastC for lastC' and c0' == c0, the signature is valid
        if (this.ring.length === 0)
            throw new Error("Ring length must be greater than 0");
        if (this.ring.length !== this.responses.length) {
            throw new Error("ring and responses length mismatch");
        }
        const G = this.curve.GtoPoint(); // generator point
        if (this.ring.length > 1) {
            // hash the message
            const messageDigest = (0, js_sha3_1.keccak256)(this.message);
            // computes the cees
            let lastComputedCp = RingSignature.computeC(
            // c1'
            this.ring, messageDigest, G, this.curve.N, this.responses[0], this.c, this.ring[0]);
            for (let i = 2; i < this.ring.length; i++) {
                // c2' -> cn'
                lastComputedCp = RingSignature.computeC(this.ring, messageDigest, G, this.curve.N, this.responses[i - 1], lastComputedCp, this.ring[i - 1]);
            }
            // return true if c0 === c0'
            return (this.c ===
                RingSignature.computeC(this.ring, messageDigest, G, this.curve.N, this.responses[this.responses.length - 1], lastComputedCp, this.ring[this.ring.length - 1]));
        }
        // if ring length = 1 :
        return (0, piSignature_1.verifyPiSignature)(this.ring[0], this.responses[0], (0, utils_1.modulo)(2n * this.c + 1n, this.curve.N), this.c, this.curve);
    }
    /**
     * Verify a RingSignature stored as a json string
     *
     * @param signature - The json signature to verify
     * @returns True if the signature is valid, false otherwise
     */
    static verify(signature) {
        const ringSignature = RingSignature.fromJsonString(signature);
        return ringSignature.verify();
    }
    /**
     * Generate an incomplete ring signature.
     * Allow the user to use its private key from an external software (external software/hardware wallet)
     *
     * @param curve - The curve to use
     * @param ring - The ring of public keys
     * @param signerKey - The signer private or public key
     * @param message - The message to sign
     * @returns An incomplete ring signature
     */
    static signature(curve, ring, signerKey, message) {
        const G = curve.GtoPoint(); // generator point
        // hash the message
        const messageDigest = (0, js_sha3_1.keccak256)(message);
        // generate random number alpha
        const alpha = (0, utils_1.randomBigint)(curve.N);
        let signerPubKey;
        if (typeof signerKey === "bigint") {
            signerPubKey = G.mult(signerKey);
        }
        else {
            signerPubKey = signerKey;
        }
        // set the signer position in the ring
        const pi = (0, utils_1.getRandomSecuredNumber)(0, ring.length - 1); // signer index
        // add the signer public key to the ring
        ring = ring.slice(0, pi).concat([signerPubKey], ring.slice(pi));
        // check for duplicates using a set
        const ringSet = new Set(ring);
        if (ringSet.size !== ring.length) {
            throw new Error("Ring contains duplicates");
        }
        // generate random responses for every public key in the ring
        const responses = [];
        for (let i = 0; i < ring.length; i++) {
            responses.push((0, utils_1.randomBigint)(curve.N));
        }
        // contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length - 1)
        const cValuesPI1N = [];
        // compute C pi+1
        cValuesPI1N.push((0, utils_1.modulo)(BigInt("0x" + (0, js_sha3_1.keccak256)(ring + messageDigest + G.mult(alpha).toString())), curve.N));
        // compute Cpi+2 to Cn
        for (let i = pi + 2; i < ring.length; i++) {
            cValuesPI1N.push(RingSignature.computeC(ring, messageDigest, G, curve.N, responses[i - 1], cValuesPI1N[i - pi - 2], ring[i - 1]));
        }
        // contains all the c from 0 to pi
        const cValues0PI = [];
        // compute c0 using cn
        cValues0PI.push(RingSignature.computeC(ring, messageDigest, G, curve.N, responses[responses.length - 1], cValuesPI1N[cValuesPI1N.length - 1], ring[ring.length - 1]));
        // compute C0 to C pi -1
        for (let i = 1; i < pi + 1; i++) {
            cValues0PI[i] = RingSignature.computeC(ring, messageDigest, G, curve.N, responses[i - 1], cValues0PI[i - 1], ring[i - 1]);
        }
        // concatenate CValues0PI, cpi and CValuesPI1N to get all the c values
        const cees = cValues0PI.concat(cValuesPI1N);
        return {
            ring: ring,
            pi: pi,
            cees: cees,
            alpha: alpha,
            signerIndex: pi,
            responses: responses,
        };
    }
    static computeC(ring, message, G, N, r, previousC, previousPubKey) {
        return (0, utils_1.modulo)(BigInt("0x" +
            (0, js_sha3_1.keccak256)(ring +
                message +
                G.mult(r).add(previousPubKey.mult(previousC)).toString())), N);
    }
}
exports.RingSignature = RingSignature;