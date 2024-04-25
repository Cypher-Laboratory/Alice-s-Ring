"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortRing = exports.checkPoint = exports.serializeRing = exports.checkRing = exports.RingSignature = void 0;
const utils_1 = require("./utils");
const piSignature_1 = require("./signature/piSignature");
const curves_1 = require("./curves");
const _1 = require(".");
const HashFunction_1 = require("./utils/HashFunction");
const err = __importStar(require("./errors"));
const isRingSorted_1 = require("./utils/isRingSorted");
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
    constructor(message, ring, c, responses, curve, config) {
        if (ring.length === 0)
            throw err.noEmptyRing;
        if (ring.length != responses.length)
            throw err.lengthMismatch("ring", "responses");
        if (c >= curve.N)
            throw err.invalidParams("c must be a < N");
        // check if config is an object
        if (config && typeof config !== "object")
            throw err.invalidParams("Config must be an object");
        // check ring, c and responses validity
        checkRing(ring, curve);
        for (const response of responses) {
            if (response >= curve.N || response === 0n)
                throw err.invalidResponses;
        }
        this.ring = ring;
        this.message = message;
        this.c = c;
        this.responses = responses;
        this.curve = curve;
        this.config = config;
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
     * Get the config
     *
     * @returns The config
     */
    getConfig() {
        return this.config;
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
        return BigInt("0x" + (0, utils_1.hash)(this.message, this.config?.hash));
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
    static fromJsonString(json) {
        let parsedJson;
        if (typeof json === "string") {
            try {
                parsedJson = JSON.parse(json);
            }
            catch (e) {
                throw err.invalidJson(e);
            }
        }
        else {
            parsedJson = json;
        }
        // check if message is stored as array or object. If so, throw an error
        if (typeof parsedJson.message !== "string")
            throw err.invalidJson("Message must be a string ");
        // check if c is stored as array or object. If so, throw an error
        if (typeof parsedJson.c !== "string" && typeof parsedJson.c !== "number")
            throw err.invalidJson("c must be a string or a number");
        // if c is a number, convert it to a string
        if (typeof parsedJson.c === "number")
            parsedJson.c = parsedJson.c.toString();
        // check if config is an object
        if (parsedJson.config && typeof parsedJson.config !== "object")
            throw err.invalidJson("Config must be an object");
        // check if config.hash is an element from HashFunction. If not, throw an error
        if (parsedJson.config &&
            parsedJson.config.hash &&
            !Object.values(HashFunction_1.HashFunction).includes(parsedJson.config.hash))
            throw err.invalidJson("Config.hash must be an element from HashFunction");
        try {
            const sig = parsedJson;
            const curve = _1.Curve.fromString(sig.curve);
            return new RingSignature(sig.message, sig.ring.map((point) => _1.Point.deserialize(point, curve)), BigInt(sig.c), sig.responses.map((response) => BigInt(response)), curve, sig.config);
        }
        catch (e) {
            throw err.invalidJson(e);
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
            ring: serializeRing(this.ring),
            c: this.c.toString(),
            responses: this.responses.map((response) => response.toString()),
            curve: this.curve.toString(),
            config: this.config,
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
        if (!utils_1.base64Regex.test(base64))
            throw err.invalidBase64();
        const decoded = Buffer.from(base64, "base64").toString("ascii");
        return RingSignature.fromJsonString(decoded);
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
     * @param config - The config params to use
     *
     * @returns A RingSignature
     */
    static sign(ring, // ring.length = n
    signerPrivateKey, message, curve, config) {
        if (signerPrivateKey === 0n || signerPrivateKey >= curve.N)
            throw err.invalidParams("Signer private key cannot be 0 and must be < N");
        // check if ring is valid
        // try {
        checkRing(ring, curve, true);
        // } catch (e) {
        //   throw err.invalidRing(e as string);
        // }
        const messageDigest = BigInt("0x" + (0, utils_1.hash)(message, config?.hash));
        const alpha = (0, utils_1.randomBigint)(curve.N);
        // get the signer public key
        const signerPubKey = (0, curves_1.derivePubKey)(signerPrivateKey, curve);
        // check if the ring is sorted by x ascending coordinate (and y ascending if x's are equal)
        if (!(0, isRingSorted_1.isRingSorted)(ring))
            throw err.invalidRing("The ring is not sorted");
        // if needed, insert the user public key at the right place (sorted by x ascending coordinate)
        let signerIndex = ring.findIndex((point) => point.x === signerPubKey.x && point.y === signerPubKey.y);
        if (signerIndex === -1) {
            signerIndex = 0;
            for (let i = 0; i < ring.length; i++) {
                if (signerPubKey.x < ring[i].x) {
                    ring.splice(i, 0, signerPubKey);
                    signerIndex = i;
                    break;
                }
                if (signerPubKey.x === ring[i].x) {
                    // order by y ascending
                    if (signerPubKey.y < ring[i].y) {
                        ring.splice(i, 0, signerPubKey);
                        signerIndex = i;
                        break;
                    }
                }
            }
        }
        if (ring.length === 0) {
            ring = [signerPubKey];
            signerIndex = 0;
        }
        // compute cpi+1
        const cpi1 = RingSignature.computeC(ring, messageDigest, { alpha: alpha }, curve, config);
        const rawSignature = RingSignature.signature(curve, ring, cpi1, signerIndex, messageDigest, config);
        // compute the signer response
        const signerResponse = (0, piSignature_1.piSignature)(alpha, rawSignature.cees[rawSignature.signerIndex], signerPrivateKey, curve);
        return new RingSignature(message, rawSignature.ring, rawSignature.cees[0], 
        // insert the signer response
        rawSignature.responses
            .slice(0, rawSignature.signerIndex)
            .concat([signerResponse], rawSignature.responses.slice(rawSignature.signerIndex + 1)), curve, config);
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
        // we compute c1' = Hash(Ring, m, [r0G, c0K0])
        // then, for each ci (1 < i < n), compute ci' = Hash(Ring, message, [riG + ciKi])
        // (G = generator, K = ring public key)
        // finally, if we substitute lastC for lastC' and c0' == c0, the signature is valid
        // hash the message
        for (const point of this.ring) {
            if (point.checkLowOrder() === false) {
                throw `The public key ${point} is not valid`;
            }
        }
        const messageDigest = this.messageDigest;
        // NOTE : the loop has at least one iteration since the ring
        // is ensured to be not empty
        let lastComputedCp = this.c;
        // compute the c values : c1 ’, c2 ’, ... , cn ’, c0 ’
        for (let i = 0; i < this.ring.length; i++) {
            lastComputedCp = RingSignature.computeC(this.ring, messageDigest, {
                previousR: this.responses[i],
                previousC: lastComputedCp,
                previousIndex: i,
            }, this.curve, this.config);
        }
        // return true if c0 === c0'
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
        if (utils_1.base64Regex.test(signature)) {
            signature = RingSignature.fromBase64(signature).toJsonString();
        }
        const ringSignature = RingSignature.fromJsonString(signature);
        return ringSignature.verify();
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
    static signature(curve, ring, ceePiPlusOne, signerIndex, messageDigest, config) {
        // check if ring is valid
        try {
            checkRing(ring, curve);
        }
        catch (e) {
            throw err.invalidRing(e);
        }
        // generate random responses for every public key in the ring
        const responses = [];
        for (let i = 0; i < ring.length; i++) {
            responses.push((0, utils_1.randomBigint)(curve.N));
        }
        // contains all the cees from 0 to ring.length - 1 (0, 1, ..., pi, ..., ring.length - 1)
        const cees = ring.map(() => 0n);
        for (let i = signerIndex + 1; i < ring.length + signerIndex + 1; i++) {
            /*
            Convert i to obtain a numbers between 0 and ring.length - 1,
            starting at pi + 1, going to ring.length and then going from 0 to pi (included)
            */
            const index = i % ring.length;
            const indexMinusOne = index - 1 >= 0n ? index - 1 : index - 1 + ring.length;
            let params = {};
            if (index === (signerIndex + 1) % ring.length)
                cees[index] = ceePiPlusOne; // params = { alpha: alpha };
            else {
                params = {
                    previousR: responses[indexMinusOne],
                    previousC: cees[indexMinusOne],
                    previousIndex: indexMinusOne,
                };
                // compute the c value
                cees[index] = RingSignature.computeC(ring, messageDigest, params, curve, config);
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
     * Compute a c value
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
     * @see params.previousR - The previous response which will be used to compute the new c value
     * @see params.previousC - The previous c value which will be used to compute the new c value
     * @see params.previousPubKey - The previous public key which will be used to compute the new c value
     * @see params.alpha - The alpha value which will be used to compute the new c value
     *
     * @returns A new c value
     */
    static computeC(ring, messageDigest, params, curve, config) {
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
            throw err.missingParams("Either 'alpha' or all the others params must be set");
        }
        if (params.alpha) {
            return (0, utils_1.modulo)(BigInt("0x" +
                (0, utils_1.hash)(serializeRing(ring).toString() +
                    messageDigest +
                    G.mult(params.alpha).serialize(), config?.hash)), N);
        }
        if (params.previousR &&
            params.previousC &&
            params.previousIndex !== undefined) {
            return (0, utils_1.modulo)(BigInt("0x" +
                (0, utils_1.hash)(serializeRing(ring).toString() +
                    messageDigest +
                    G.mult(params.previousR)
                        .add(ring[params.previousIndex].mult(params.previousC))
                        .serialize(), config?.hash)), N);
        }
        throw err.missingParams("Either 'alpha' or all the others params must be set");
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
        throw err.noEmptyRing;
    if (!ref)
        ref = ring[0].curve;
    // check for duplicates using a set
    if (new Set(serializeRing(ring)).size !== ring.length)
        throw err.noDuplicates("ring");
    // check if all the points are valid
    try {
        for (const point of ring) {
            checkPoint(point, ref);
        }
    }
    catch (e) {
        throw err.invalidPoint(("At least one point is not valid: " + e));
    }
}
exports.checkRing = checkRing;
/**
 * Serialize a ring, i.e., serialize each point in the ring
 *
 * @param ring - The ring to serialize
 *
 * @returns The serialized ring as a string array
 */
function serializeRing(ring) {
    const serializedPoints = [];
    for (const point of ring) {
        serializedPoints.push(point.serialize()); // Call serialize() on each 'point' object
    }
    return serializedPoints;
}
exports.serializeRing = serializeRing;
/**
 * Check if a point is valid
 *
 * @param point - The point to check
 * @param curve - The curve to use as a reference
 *
 * @throws Error if the point is not on the reference curve
 * @throws Error if at least 1 coordinate is not valid (= 0 or >= curve order)
 */
function checkPoint(point, curve) {
    if (curve && !curve.equals(point.curve)) {
        throw err.curveMismatch();
    }
    // check if the point is on the reference curve
    if (!point.curve.isOnCurve(point)) {
        throw err.notOnCurve();
    }
}
exports.checkPoint = checkPoint;
/**
 * Sort a ring by x ascending coordinate (and y ascending if x's are equal)
 *
 * @param ring the ring to sort
 * @returns the sorted ring
 */
function sortRing(ring) {
    return ring.sort((a, b) => {
        if (a.x !== b.x) {
            return a.x < b.x ? -1 : 1;
        }
        return a.y < b.y ? -1 : 1;
    });
}
exports.sortRing = sortRing;
