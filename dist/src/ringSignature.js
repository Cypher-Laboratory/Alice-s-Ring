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
     */
    constructor(message, ring, c, responses, curve) {
        if (ring.length != responses.length)
            throw new Error("Ring and responses length mismatch");
        this.ring = ring;
        this.message = message;
        this.c = c;
        this.responses = responses;
        this.curve = curve;
    }
    /**
     * Create a RingSignature from a RingSig
     *
     * @param sig - The RingSig to convert
     *
     * @returns A RingSignature
     */
    static fromRingSig(sig) {
        return new RingSignature(sig.message, sig.ring, sig.c, sig.responses, sig.curve);
    }
    /**
     * Transform a RingSignature into a RingSig
     *
     * @returns A RingSig
     */
    toRingSig() {
        return {
            message: this.message,
            ring: this.ring,
            c: this.c,
            responses: this.responses,
            curve: this.curve,
        };
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
        const ring = json.ring.map((point) => utils_1.Point.fromBase64(point));
        return new RingSignature(json.message, ring, BigInt(json.c), json.responses.map((response) => BigInt(response)), json.curve);
    }
    /**
     * Encode a ring signature to base64 string
     */
    toBase64() {
        const json = JSON.stringify({
            message: this.message,
            ring: this.ring.map((point) => point.toBase64()),
            c: this.c.toString(),
            responses: this.responses.map((response) => response.toString()),
            curve: this.curve,
        });
        return Buffer.from(json).toString("base64");
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
    signerPrivateKey, message, curve = utils_1.Curve.SECP256K1) {
        let G; // generator point
        let N; // order of the curve
        switch (curve) {
            case utils_1.Curve.SECP256K1:
                G = new utils_1.Point(curve, utils_1.SECP256K1.G);
                N = utils_1.SECP256K1.N;
                break;
            case utils_1.Curve.ED25519:
                G = new utils_1.Point(utils_1.Curve.ED25519, utils_1.ED25519.G);
                N = utils_1.ED25519.N;
                break;
            default:
                throw new Error("unknown curve");
        }
        if (ring.length === 0) {
            /*
              * If the ring is empty, we just sign the message using our schnorr-like signature scheme
              * and return a ring signature with only one response.
              * Note that alpha is computed from c to allow verification.
            */
            const c = (0, utils_1.randomBigint)(N);
            const alpha = (0, utils_1.modulo)(2n * c - 1n, N);
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
    message, signerPubKey, curve = utils_1.Curve.SECP256K1) {
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
        if (this.ring.length !== this.responses.length) {
            throw new Error("ring and responses length mismatch");
        }
        let G; // generator point
        let N; // order of the curve
        switch (this.curve) {
            case utils_1.Curve.SECP256K1: {
                G = new utils_1.Point(this.curve, utils_1.SECP256K1.G);
                N = utils_1.SECP256K1.N;
                break;
            }
            case utils_1.Curve.ED25519: {
                G = new utils_1.Point(this.curve, utils_1.ED25519.G);
                N = utils_1.ED25519.N;
                break;
            }
            default: {
                throw new Error("unknown curve");
            }
        }
        if (this.ring.length > 1) {
            // hash the message
            const messageDigest = (0, js_sha3_1.keccak256)(this.message);
            // computes the cees
            let lastComputedCp = RingSignature.computeC(this.ring, messageDigest, G, N, this.responses[0], this.c, this.ring[0]);
            for (let i = 2; i < this.ring.length; i++) {
                lastComputedCp = RingSignature.computeC(this.ring, messageDigest, G, N, this.responses[i - 1], lastComputedCp, this.ring[i - 1]);
            }
            // return true if c0 === c0'
            return (this.c ===
                RingSignature.computeC(this.ring, messageDigest, G, N, this.responses[this.responses.length - 1], lastComputedCp, this.ring[this.ring.length - 1]));
        }
        if (this.ring.length === 0)
            throw new Error("Ring length must be greater than 0");
        return (0, piSignature_1.verifyPiSignature)(this.ring[0], this.responses[0], (0, utils_1.modulo)(2n * this.c - 1n, N), this.c, this.curve);
    }
    /**
     * Verify a RingSignature stored as a RingSig
     *
     * @param signature - The RingSig to verify
     * @returns True if the signature is valid, false otherwise
     */
    static verify(signature) {
        const ringSignature = RingSignature.fromRingSig(signature);
        return ringSignature.verify();
    }
    /**
     * Generate an incomplete ring signature
     *
     * @param curve - The curve to use
     * @param ring - The ring of public keys
     * @param signerKey - The signer private or public key
     * @param message - The message to sign
     * @returns An incomplete ring signature
     */
    static signature(curve, ring, signerKey, message) {
        let N; // order of the curve
        let G; // generator point
        switch (curve) {
            case utils_1.Curve.SECP256K1:
                N = utils_1.SECP256K1.N;
                G = new utils_1.Point(curve, utils_1.SECP256K1.G);
                break;
            case utils_1.Curve.ED25519:
                N = utils_1.ED25519.N;
                G = new utils_1.Point(utils_1.Curve.ED25519, utils_1.ED25519.G);
                break;
            default:
                throw new Error("unknown curve");
        }
        // hash the message
        const messageDigest = (0, js_sha3_1.keccak256)(message);
        // generate random number alpha
        const alpha = (0, utils_1.randomBigint)(N);
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
        // check for duplicates
        for (let i = 0; i < ring.length; i++) {
            // complexity.. :(
            for (let j = i + 1; j < ring.length; j++) {
                if (ring[i].x === ring[j].x && ring[i].y === ring[j].y) {
                    throw new Error("Ring contains duplicate public keys");
                }
            }
        }
        // generate random responses for every public key in the ring
        const responses = [];
        for (let i = 0; i < ring.length; i++) {
            responses.push((0, utils_1.randomBigint)(N));
        }
        // contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length)
        const cValuesPI1N = [];
        // compute C pi+1
        cValuesPI1N.push((0, utils_1.modulo)(BigInt("0x" + (0, js_sha3_1.keccak256)(ring + messageDigest + G.mult(alpha).toString())), N));
        // compute Cpi+2 to Cn
        for (let i = pi + 2; i < ring.length; i++) {
            cValuesPI1N.push(RingSignature.computeC(ring, messageDigest, G, N, responses[i - 1], cValuesPI1N[i - pi - 2], ring[i - 1]));
        }
        // contains all the c from 0 to pi
        const cValues0PI = [];
        // compute C0
        cValues0PI.push(RingSignature.computeC(ring, messageDigest, G, N, responses[responses.length - 1], cValuesPI1N[cValuesPI1N.length - 1], ring[ring.length - 1]));
        // compute C0 to C pi -1
        for (let i = 1; i < pi + 1; i++) {
            cValues0PI[i] = RingSignature.computeC(ring, messageDigest, G, N, responses[i - 1], cValues0PI[i - 1], ring[i - 1]);
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
