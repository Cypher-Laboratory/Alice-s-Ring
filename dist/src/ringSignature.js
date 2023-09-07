"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingSignature = void 0;
const js_sha3_1 = require("js-sha3");
const utils_1 = require("./utils");
const piSignature_1 = require("./signature/piSignature");
class RingSignature {
    /**
     * Ring signature class constructor
     *
     * @param message - Clear message to sign
     * @param ring - Ring of public keys
     * @param cees - c values
     * @param responses - Responses for each public key in the ring
     */
    constructor(message, ring, cees, responses) {
        this.ring = ring;
        this.message = message;
        this.cees = cees;
        this.responses = responses;
    }
    /**
     * Create a RingSignature from a RingSig
     *
     * @param sig - The RingSig to convert
     *
     * @returns A RingSignature
     */
    static fromRingSig(sig) {
        return new RingSignature(sig.message, sig.ring, sig.cees, sig.responses);
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
            cees: this.cees,
            responses: this.responses,
        };
    }
    /**
     * Sign a message using ring signatures
     *
     * @param ring - Ring of public keys
     * @param signerPrivKey - Private key of the signer
     * @param message - Clear message to sign
     *
     * @returns A RingSignature
     */
    static sign(ring, // ring.length = n
    signerPrivKey, message) {
        // generate random number alpha
        const alpha = (0, utils_1.randomBigint)(utils_1.P);
        const pi = (0, utils_1.getRandomSecuredNumber)(0, ring.length - 1); // signer index
        // generate random fake responses for everybody except the signer
        const fakeResponses = [];
        for (let i = 0; i < ring.length; i++) {
            fakeResponses.push((0, utils_1.randomBigint)(utils_1.P));
        }
        // supposed to contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length)
        const cValuesPI1N = [];
        // compute C pi+1
        cValuesPI1N.push(BigInt("0x" +
            (0, js_sha3_1.keccak256)(ring + message + String(alpha * utils_1.G[0]) + String(alpha * utils_1.G[1]))));
        // compute C pi+2 to C n
        for (let i = pi + 2; i < ring.length; i++) {
            cValuesPI1N.push(BigInt("0x" +
                (0, js_sha3_1.keccak256)(ring +
                    message +
                    String(fakeResponses[i] * utils_1.G[0] +
                        BigInt("0x" + cValuesPI1N[i - pi - 2]) * ring[i][0] +
                        BigInt("0x" + cValuesPI1N[i - pi - 2]) * ring[i][1] +
                        fakeResponses[i] * utils_1.G[1]))));
        }
        // supposed to contains all the c from 0 to pi-1
        const cValues0PI1 = [];
        // compute C 0
        cValues0PI1.push(BigInt("0x" +
            (0, js_sha3_1.keccak256)(ring +
                message +
                String(fakeResponses[ring.length - 1] * utils_1.G[0] +
                    BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
                        ring[ring.length - 1][0] +
                    BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
                        ring[ring.length - 1][1] +
                    fakeResponses[ring.length - 1] * utils_1.G[1]))));
        // compute C 1 to C pi -1
        for (let i = 1; i < pi + 1; i++) {
            cValues0PI1[i] = BigInt("0x" +
                (0, js_sha3_1.keccak256)(ring +
                    message +
                    String(fakeResponses[i] * utils_1.G[0] +
                        BigInt("0x" + cValues0PI1[i - 1]) * ring[i][0] +
                        BigInt("0x" + cValues0PI1[i - 1]) * ring[i][1] +
                        fakeResponses[i] * utils_1.G[1])));
        }
        // concatenate CValues0PI1 and CValuesPI1N to get all the c values
        const cees = cValues0PI1.concat(cValuesPI1N);
        // compute the signer response
        const signerResponse = (0, piSignature_1.piSignature)(alpha, cees[pi], signerPrivKey, utils_1.P);
        return new RingSignature(message, ring, cees, 
        // concatenate all the fake responses with the signer response (respecting the order)
        fakeResponses
            .slice(0, pi)
            .concat([signerResponse])
            .concat(fakeResponses.slice(pi, fakeResponses.length)));
    }
    /**
     * Verify a RingSignature
     *
     * @returns True if the signature is valid, false otherwise
     */
    verify() {
        // compare c1 with the computed c'1 = keccak256(ring, message, rn*Gx + rn*Gy + cn*Kx + cn*Ky)
        // (G = generator, K = ring public key)
        return (BigInt("0x" +
            (0, js_sha3_1.keccak256)(this.ring +
                this.message +
                String(this.responses[this.responses.length - 1] * utils_1.G[0] +
                    BigInt("0x" + this.cees[this.cees.length - 1]) *
                        this.ring[this.ring.length - 1][0] +
                    BigInt("0x" + this.cees[this.cees.length - 1]) *
                        this.ring[this.ring.length - 1][1] +
                    this.responses[this.responses.length - 1] * utils_1.G[1]))) === this.cees[0]);
    }
}
exports.RingSignature = RingSignature;
