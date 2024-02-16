import {
  randomBigint,
  getRandomSecuredNumber,
  modulo,
  formatRing,
  formatPoint,
  hash,
  base64Regex,
} from "./utils";
import { piSignature } from "./signature/piSignature";
import { derivePubKey } from "./curves";
import { Curve, Point } from ".";
import { SignatureConfig } from "./interfaces";
import { hashFunction } from "./utils/hashFunction";
import * as err from "./errors";

/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 */
export class RingSignature {
  private message: string; // clear message
  private c: bigint;
  private responses: bigint[];
  private ring: Point[];
  private curve: Curve;
  private config?: SignatureConfig;

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
  constructor(
    message: string,
    ring: Point[],
    c: bigint,
    responses: bigint[],
    curve: Curve,
    config?: SignatureConfig,
  ) {
    if (!message || message === "") throw err.noEmptyMsg;

    if (ring.length === 0) throw err.noEmptyRing;

    if (ring.length != responses.length)
      throw err.lengthMismatch("ring", "responses");

    // check if config is an object
    if (config && typeof config !== "object")
      throw err.invalidParams("Config must be an object");

    // check ring, c and responses validity
    checkRing(ring, curve, true);

    if (c === 0n) throw err.invalidParams("c");
    for (const response of responses) {
      if (response >= curve.N || response === 0n) throw err.invalidResponses;
    }

    this.ring = ring;
    this.message = message;
    this.c = c;
    this.responses = responses;
    this.curve = curve;
    this.config = config;
  }

  /**
   * Get the message
   *
   * @returns The message
   */
  getRing(): Point[] {
    return this.ring;
  }

  /**
   * Get the challenge value
   *
   * @returns The challenge value
   */
  getChallenge(): bigint {
    return this.c;
  }

  /**
   * Get the responses
   *
   * @returns The responses
   */
  getResponses(): bigint[] {
    return this.responses;
  }

  /**
   * Get the curve
   *
   * @returns The curve
   */
  getCurve(): Curve {
    return this.curve;
  }

  /**
   * Get the config
   *
   * @returns The config
   */
  getConfig(): SignatureConfig | undefined {
    return this.config;
  }

  /**
   * Get the message
   *
   * @returns The message
   */
  getMessage(): string {
    return this.message;
  }

  /**
   * Get the message digest
   *
   * @returns The message digest
   */
  get messageDigest(): bigint {
    return BigInt("0x" + hash(this.message, this.config?.hash));
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
  static fromJsonString(json: string | object): RingSignature {
    let parsedJson;
    if (typeof json === "string") {
      try {
        parsedJson = JSON.parse(json);
      } catch (e) {
        throw err.invalidJson(e);
      }
    } else {
      parsedJson = json;
    }
    // check if message is stored as array or object. If so, throw an error
    if (
      parsedJson.message instanceof Array ||
      typeof parsedJson.message === "object"
    )
      throw err.invalidJson("Message must be a string or a number");
    // check if c is stored as array or object. If so, throw an error
    if (parsedJson.c instanceof Array || typeof parsedJson.c === "object")
      throw err.invalidJson("c must be a string or a number");
    // check if config is an object
    if (parsedJson.config && typeof parsedJson.config !== "object")
      throw err.invalidJson("Config must be an object");
    // check if config.safeMode is a boolean. If not, throw an error
    if (
      parsedJson.config &&
      parsedJson.config.safeMode &&
      typeof parsedJson.config.safeMode !== "boolean"
    )
      throw err.invalidJson("Config.safeMode must be a boolean");
    // check if config.hash is an element from hashFunction. If not, throw an error
    if (
      parsedJson.config &&
      parsedJson.config.hash &&
      !Object.values(hashFunction).includes(parsedJson.config.hash)
    )
      throw err.invalidJson("Config.hash must be an element from hashFunction");

    try {
      const sig = parsedJson as {
        message: string;
        ring: string[];
        c: string;
        responses: string[];
        curve: string;
        config?: SignatureConfig;
      };
      return new RingSignature(
        sig.message,
        sig.ring.map((point: string) => Point.fromString(point)),
        BigInt(sig.c),
        sig.responses.map((response: string) => BigInt(response)),
        Curve.fromString(sig.curve),
        sig.config,
      );
    } catch (e) {
      throw err.invalidJson(e);
    }
  }

  /**
   * Create a Json string from a RingSignature
   *
   * @returns A json string
   */
  toJsonString(): string {
    return JSON.stringify({
      message: this.message,
      ring: this.ring.map((point: Point) => point.toString()),
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
  static fromBase64(base64: string): RingSignature {
    // check if the base64 string is valid
    if (!base64Regex.test(base64)) throw err.invalidBase64();

    const decoded = Buffer.from(base64, "base64").toString("ascii");
    const json = JSON.parse(decoded);
    const ring = json.ring.map((point: string) => Point.fromString(point));

    return new RingSignature(
      json.message,
      ring,
      BigInt(json.c),
      json.responses.map((response: string) => BigInt(response)),
      Curve.fromString(json.curve),
      json.config,
    );
  }

  /**
   * Encode a ring signature to base64 string
   */
  toBase64(): string {
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
  static sign(
    ring: Point[], // ring.length = n+1
    signerPrivateKey: bigint,
    message: string,
    curve: Curve,
    config?: SignatureConfig,
  ): RingSignature {
    if (signerPrivateKey === 0n)
      throw err.invalidParams("Signer private key cannot be 0");

    if (message === "") throw err.noEmptyMsg;

    const messageDigest = BigInt("0x" + hash(message, config?.hash));

    // check if ring is valid
    try {
      checkRing(ring, curve, true);
    } catch (e) {
      throw err.invalidRing(e as string);
    }

    const alpha = randomBigint(curve.N);

    // get the signer public key
    const signerPubKey: Point = derivePubKey(signerPrivateKey, curve);

    // add the signer public key to the ring
    ring = ring.concat([signerPubKey]);

    // order ring by x coordinate ascending
    ring.sort((a, b) => {
      if (a.x < b.x) return -1;
      if (a.x > b.x) return 1;
      return 0;
    });

    // set the signer position in the ring from its position in the ordered ring
    const signerIndex = ring.findIndex((point) => point.equals(signerPubKey));

    // compute cpi+1
    const cpi1 = RingSignature.computeC(
      ring,
      messageDigest,
      { alpha: alpha },
      curve,
      config,
    );

    const rawSignature = RingSignature.signature(
      curve,
      ring,
      cpi1,
      signerIndex,
      messageDigest,
      config,
    );

    // compute the signer response
    const signerResponse = piSignature(
      alpha,
      rawSignature.cees[rawSignature.signerIndex],
      signerPrivateKey,
      curve,
    );

    return new RingSignature(
      message,
      rawSignature.ring,
      rawSignature.cees[0],
      // insert the signer response
      rawSignature.responses
        .slice(0, rawSignature.signerIndex)
        .concat(
          [signerResponse],
          rawSignature.responses.slice(rawSignature.signerIndex + 1),
        ),
      curve,
      config,
    );
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
  verify(): boolean {
    // we compute c1' = Hash(Ring, m, [r0G, c0K0])
    // then, for each ci (1 < i < n), compute ci' = Hash(Ring, message, [riG + ciKi])
    // (G = generator, K = ring public key)
    // finally, if we substitute lastC for lastC' and c0' == c0, the signature is valid
    if (this.ring.length === 0) throw err.noEmptyRing;

    if (this.ring.length !== this.responses.length) {
      throw err.lengthMismatch("ring", "responses");
    }

    // hash the message
    const messageDigest = BigInt("0x" + hash(this.message, this.config?.hash));

    // computes the cees
    let lastComputedCp = RingSignature.computeC(
      // c1'
      this.ring,
      messageDigest,
      {
        previousR: this.responses[0],
        previousC: this.c,
        previousPubKey: this.ring[0],
      },
      this.curve,
      this.config,
    );

    // compute the c values: c2', c3', ..., cn', c0'
    for (let i = 1; i < this.ring.length; i++) {
      lastComputedCp = RingSignature.computeC(
        this.ring,
        messageDigest,
        {
          previousR: this.responses[i],
          previousC: lastComputedCp,
          previousPubKey: this.ring[i],
        },
        this.curve,
        this.config,
      );
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
  static verify(signature: string): boolean {
    // check if the signature is a json or a base64 string
    if (base64Regex.test(signature)) {
      signature = Buffer.from(signature, "base64").toString("ascii");
    }
    const ringSignature: RingSignature =
      RingSignature.fromJsonString(signature);
    return ringSignature.verify();
  }

  /**
   * Generate an incomplete ring signature.
   *
   * @param curve - The curve to use
   * @param ring - The ring of public keys
   * @param ceePiPlusOne - The Cpi+1 value
   * @param signerIndex - The signer index in the ring
   * @param message - The message to sign
   * @param config - The config params to use
   *
   * @returns An incomplete ring signature
   */
  private static signature(
    curve: Curve,
    ring: Point[],
    ceePiPlusOne: bigint,
    signerIndex: number,
    messageDigest: bigint,
    config?: SignatureConfig,
  ): {
    ring: Point[];
    cees: bigint[];
    signerIndex: number;
    responses: bigint[];
  } {
    if (
      messageDigest === 0n ||
      messageDigest === BigInt("0x" + hash("", config?.hash))
    )
      throw err.noEmptyMsg;

    // check ring and responses validity
    if (ring.length !== ring.length)
      throw err.lengthMismatch("ring", "responses");

    // check if ring is valid
    try {
      checkRing(ring, curve, true);
    } catch (e) {
      throw err.invalidRing(e as string);
    }

    // generate random responses for every public key in the ring
    const responses: bigint[] = [];
    for (let i = 0; i < ring.length; i++) {
      responses.push(randomBigint(curve.N));
    }

    // contains all the cees from 0 to ring.length - 1 (0, 1, ..., pi, ..., ring.length - 1)
    const cees: bigint[] = ring.map(() => 0n);

    for (let i = signerIndex + 1; i < ring.length + signerIndex + 1; i++) {
      /* 
      Convert i to obtain a numbers between 0 and ring.length - 1, 
      starting at pi + 1, going to ring.length and then going from 0 to pi (included)
      */
      const index = i % ring.length;
      const indexMinusOne =
        index - 1 >= 0n ? index - 1 : index - 1 + ring.length;

      let params = {};
      if (index === (signerIndex + 1) % ring.length)
        cees[index] = ceePiPlusOne; // params = { alpha: alpha };
      else {
        params = {
          previousR: responses[indexMinusOne],
          previousC: cees[indexMinusOne],
          previousPubKey: ring[indexMinusOne],
        };

        // compute the c value
        cees[index] = RingSignature.computeC(
          ring,
          messageDigest,
          params,
          curve,
          config,
        );
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
  private static computeC(
    ring: Point[],
    messageDigest: bigint,
    params: {
      previousR?: bigint;
      previousC?: bigint;
      previousPubKey?: Point;
      alpha?: bigint;
    },
    curve: Curve,
    config?: SignatureConfig,
  ): bigint {
    const G = curve.GtoPoint();
    const N = curve.N;

    let hashFct = hashFunction.KECCAK256;
    if (config?.hash) hashFct = config.hash;

    if (params.alpha) {
      return modulo(
        BigInt(
          "0x" +
          hash(
            formatRing(ring) +
            messageDigest +
            formatPoint(G.mult(params.alpha)),
            hashFct,
          ),
        ),
        N,
      );
    }
    if (params.previousR && params.previousC && params.previousPubKey) {
      return modulo(
        BigInt(
          "0x" +
          hash(
            formatRing(ring) +
            messageDigest +
            formatPoint(
              G.mult(params.previousR).add(
                params.previousPubKey.mult(params.previousC),
              ),
            ),
            hashFct,
          ),
        ),
        N,
      );
    }

    throw err.missingParams(
      "Either 'alpha' or all the others params must be set",
    );
  }
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
export function checkRing(ring: Point[], ref?: Curve, emptyRing = false): void {
  if (!ref) ref = ring[0].curve;

  // check if the ring is empty
  if (ring.length === 0 && !emptyRing) throw err.noEmptyRing;

  // check for duplicates using a set
  if (new Set(ring).size !== ring.length) throw err.noDuplicates("ring");

  // check if all the points are valid
  try {
    for (const point of ring) {
      checkPoint(point, ref);
    }
  } catch (e) {
    throw err.invalidPoint(("At least one point is not valid: " + e) as string);
  }
}

/**
 * Check if a point is valid
 *
 * @param point - The point to check
 * @param curve - The curve to use as a reference
 *
 * @throws Error if the point is not on the reference curve
 * @throws Error if at least 1 coordinate is not valid (= 0 or >= curve order)
 */
export function checkPoint(point: Point, curve?: Curve): void {
  // check if the point is on the reference curve
  if (!point.curve.isOnCurve(point)) {
    throw err.notOnCurve();
  }

  if (curve && !curve.equals(point.curve)) {
    throw err.curveMismatch();
  }
}
