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
 *
 * @remarks
 * For know, only SECP256K1 curve is fully supported.
 * ED25519 is on its way and then we would be able to sign using both curves at the same time
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
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys (does not contain the signer public key)
     * @param signerPrivKey - Private key of the signer
     * @param message - Clear message to sign
     *
     * @returns A RingSignature
     */
    static sign(ring, // ring.length = n
    signerPrivKey, message, curve = utils_1.Curve.SECP256K1) {
        let P; // order of the curve
        let G; // generator point
        switch (curve) {
            case utils_1.Curve.SECP256K1:
                P = utils_1.SECP256K1.P;
                G = utils_1.SECP256K1.G;
                break;
            case utils_1.Curve.ED25519:
                throw new Error("ED25519 signing is not implemented yet");
            default:
                throw new Error("unknown curve");
        }
        // hash the message
        const messageDigest = (0, js_sha3_1.keccak256)(message);
        // generate random number alpha
        const alpha = (0, utils_1.randomBigint)(P);
        // set the signer position in the ring
        if (curve !== utils_1.Curve.SECP256K1)
            throw new Error("Curve not supported");
        const signerPubKey = (0, utils_1.mult)(signerPrivKey, G);
        const pi = (0, utils_1.getRandomSecuredNumber)(0, ring.length - 1); // signer index
        // add the signer public key to the ring
        ring = ring.slice(0, pi).concat([signerPubKey], ring.slice(pi));
        // check for duplicates
        for (let i = 0; i < ring.length; i++) {
            // complexity.. :(
            for (let j = i + 1; j < ring.length; j++) {
                if (ring[i][0] === ring[j][0] && ring[i][1] === ring[j][1]) {
                    throw new Error("Ring contains duplicate public keys");
                }
            }
        }
        // generate random fake responses for everybody except the signer
        const responses = [];
        for (let i = 0; i < ring.length; i++) {
            responses.push((0, utils_1.mult)((0, utils_1.randomBigint)(P), G));
        }
        // supposed to contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length)
        const cValuesPI1N = [];
        // compute C pi+1
        cValuesPI1N.push(BigInt("0x" +
            (0, js_sha3_1.keccak256)(ring + messageDigest + String((0, utils_1.modulo)((0, utils_1.mult)(alpha, G), P)))));
        // compute Cpi+2 to Cn
        for (let i = pi + 2; i < ring.length; i++) {
            cValuesPI1N.push(BigInt("0x" +
                (0, js_sha3_1.keccak256)(ring +
                    messageDigest +
                    String((0, utils_1.modulo)((0, utils_1.add)(responses[i - 1], (0, utils_1.mult)(cValuesPI1N[i - pi - 2], ring[i - 1])), P)))));
        }
        // supposed to contains all the c from 0 to pi
        const cValues0PI = [];
        // compute C0
        cValues0PI.push(BigInt("0x" +
            (0, js_sha3_1.keccak256)(ring +
                messageDigest +
                String((0, utils_1.modulo)((0, utils_1.add)(responses[responses.length - 1], (0, utils_1.mult)(cValuesPI1N[cValuesPI1N.length - 1], ring[ring.length - 1])), P)))));
        // compute C0 to C pi -1
        for (let i = 1; i < pi + 1; i++) {
            cValues0PI[i] = BigInt("0x" +
                (0, js_sha3_1.keccak256)(ring +
                    messageDigest +
                    String((0, utils_1.modulo)((0, utils_1.add)(responses[i - 1], (0, utils_1.mult)(cValues0PI[i - 1], ring[i - 1])), P))));
        }
        // concatenate CValues0PI, cpi and CValuesPI1N to get all the c values
        const cees = cValues0PI.concat(cValuesPI1N);
        // compute the signer response
        const signerResponse = (0, piSignature_1.piSignature)(alpha, cees[pi], signerPrivKey, curve);
        return new RingSignature(message, ring, cees[0], 
        // insert the signer response
        responses.slice(0, pi).concat([signerResponse], responses.slice(pi + 1)), curve);
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
        let P; // order of the curve
        let G; // generator point
        switch (curve) {
            case utils_1.Curve.SECP256K1:
                P = utils_1.SECP256K1.P;
                G = utils_1.SECP256K1.G;
                break;
            case utils_1.Curve.ED25519:
                throw new Error("ED25519 signing is not implemented yet");
            default:
                throw new Error("unknown curve");
        }
        // hash the message
        const messageDigest = (0, js_sha3_1.keccak256)(message);
        // generate random number alpha
        const alpha = (0, utils_1.randomBigint)(P);
        // set the signer position in the ring
        if (curve !== utils_1.Curve.SECP256K1)
            throw new Error("Curve not supported");
        const pi = (0, utils_1.getRandomSecuredNumber)(0, ring.length - 1); // signer index
        // add the signer public key to the ring
        ring = ring.slice(0, pi).concat([signerPubKey], ring.slice(pi));
        // check for duplicates
        for (let i = 0; i < ring.length; i++) {
            // complexity.. :(
            for (let j = i + 1; j < ring.length; j++) {
                if (ring[i][0] === ring[j][0] && ring[i][1] === ring[j][1]) {
                    throw new Error("Ring contains duplicate public keys");
                }
            }
        }
        // generate random fake responses for everybody
        const responses = [];
        for (let i = 0; i < ring.length; i++) {
            responses.push((0, utils_1.mult)((0, utils_1.randomBigint)(P), G));
        }
        // supposed to contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length)
        const cValuesPI1N = [];
        // compute C pi+1
        cValuesPI1N.push(BigInt("0x" +
            (0, js_sha3_1.keccak256)(ring + messageDigest + String((0, utils_1.modulo)((0, utils_1.mult)(alpha, G), P)))));
        // compute Cpi+2 to Cn
        for (let i = pi + 2; i < ring.length; i++) {
            cValuesPI1N.push(BigInt("0x" +
                (0, js_sha3_1.keccak256)(ring +
                    messageDigest +
                    String((0, utils_1.modulo)((0, utils_1.add)(responses[i - 1], (0, utils_1.mult)(cValuesPI1N[i - pi - 2], ring[i - 1])), P)))));
        }
        // supposed to contains all the c from 0 to pi
        const cValues0PI = [];
        // compute C0
        cValues0PI.push(BigInt("0x" +
            (0, js_sha3_1.keccak256)(ring +
                messageDigest +
                String((0, utils_1.modulo)((0, utils_1.add)(responses[responses.length - 1], (0, utils_1.mult)(cValuesPI1N[cValuesPI1N.length - 1], ring[ring.length - 1])), P)))));
        // compute C0 to C pi -1
        for (let i = 1; i < pi + 1; i++) {
            cValues0PI[i] = BigInt("0x" +
                (0, js_sha3_1.keccak256)(ring +
                    messageDigest +
                    String((0, utils_1.modulo)((0, utils_1.add)(responses[i - 1], (0, utils_1.mult)(cValues0PI[i - 1], ring[i - 1])), P))));
        }
        // concatenate CValues0PI, cpi and CValuesPI1N to get all the c values
        const cees = cValues0PI.concat(cValuesPI1N);
        return {
            message: message,
            ring: ring,
            cees: cees,
            alpha: alpha,
            signerIndex: pi,
            responses_0_pi: responses.slice(0, pi),
            responses_pi_n: responses.slice(pi + 1, responses.length),
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
        return new RingSignature(partialSig.message, partialSig.ring, partialSig.cees[0], partialSig.responses_0_pi.concat([signerResponse], partialSig.responses_pi_n), partialSig.curve);
    }
    /**
     * Verify a RingSignature
     *
     * @returns True if the signature is valid, false otherwise
     */
    verify() {
        // we compute c1' = Hash(Ring, m, [r0G, c0K0])
        // then, for each ci (i > 1), compute ci' = Hash(Ring, message, [riG + ciKi])
        // (G = generator, K = ring public key)
        // finally, if we substitute lastC for lastC' and c0' == c0, the signature is valid
        if (this.ring.length !== this.responses.length) {
            throw new Error("ring and responses length mismatch");
        }
        let P; // order of the curve
        switch (this.curve) {
            case utils_1.Curve.SECP256K1: {
                P = utils_1.SECP256K1.P;
                break;
            }
            case utils_1.Curve.ED25519: {
                throw new Error("ED25519 signature verification is not implemented yet");
            }
            default: {
                throw new Error("unknown curve");
            }
        }
        if (this.ring.length > 1) {
            // hash the message
            const messageDigest = (0, js_sha3_1.keccak256)(this.message);
            // computes the cees
            let lastComputedCp = BigInt("0x" +
                (0, js_sha3_1.keccak256)(this.ring +
                    messageDigest +
                    String((0, utils_1.modulo)((0, utils_1.add)(this.responses[0], (0, utils_1.mult)(this.c, this.ring[0])), P))));
            for (let i = 2; i < this.ring.length; i++) {
                lastComputedCp = BigInt("0x" +
                    (0, js_sha3_1.keccak256)(this.ring +
                        messageDigest +
                        String((0, utils_1.modulo)((0, utils_1.add)(this.responses[i - 1], (0, utils_1.mult)(lastComputedCp, this.ring[i - 1])), P))));
            }
            // return true if c0 === c0'
            return (this.c ===
                BigInt("0x" +
                    (0, js_sha3_1.keccak256)(this.ring +
                        messageDigest +
                        String((0, utils_1.modulo)((0, utils_1.add)(this.responses[this.responses.length - 1], (0, utils_1.mult)(lastComputedCp, this.ring[this.ring.length - 1])), P)))));
        }
        return false;
    }
    static verify(signature) {
        const ringSignature = RingSignature.fromRingSig(signature);
        return ringSignature.verify();
    }
}
exports.RingSignature = RingSignature;
