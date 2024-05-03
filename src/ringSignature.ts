import { randomBigint, modulo, hash, base64Regex } from "./utils";
import { piSignature } from "./signature/piSignature";
import { CurveName, derivePubKey } from "./curves";
import { Curve, Point } from ".";
import { SignatureConfig } from "./interfaces";
import { HashFunction } from "./utils/hashFunction";
import * as err from "./errors";
import { isRingSorted } from "./utils/isRingSorted";

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
   * @param c - c value
   * @param responses - Responses for each public key in the ring
   * @param curve - Curve used for the signature
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
    if (ring.length === 0) throw err.noEmptyRing;

    if (ring.length != responses.length)
      throw err.lengthMismatch("ring", "responses");

    if (c >= curve.N) throw err.invalidParams("c must be a < N");

    // check if config is an object
    if (config && typeof config !== "object")
      throw err.invalidParams("Config must be an object");

    // evm compatibility does not work with ed25519
    if (curve.name === CurveName.ED25519 && config?.evmCompatibility)
      throw err.invalidParams("EVM compatibility is not available for ed25519");

    // check ring, c and responses validity
    checkRing(ring, curve);

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
   * Get the Ring
   *
   * @returns The Ring
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
    // Never hash the message with evmCompatibility = true
    return BigInt(
      "0x" + hash([this.message], { ...this.config, evmCompatibility: false }),
    );
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
    if (
      parsedJson.config &&
      parsedJson.config.hash &&
      !Object.values(HashFunction).includes(parsedJson.config.hash)
    )
      throw err.invalidJson("Config.hash must be an element from HashFunction");
    try {
      const sig = parsedJson as {
        message: string;
        ring: string[];
        c: string;
        responses: string[];
        curve: string;
        config?: SignatureConfig;
      };
      const curve = Curve.fromString(sig.curve);
      return new RingSignature(
        sig.message,
        sig.ring.map((point: string) =>
          Point.deserialize(bigIntToPublicKey(BigInt(point))),
        ),
        BigInt(sig.c),
        sig.responses.map((response: string) => BigInt(response)),
        curve,
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
      ring: serializeRing(this.ring).map((bi) => bi.toString()),
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
    return RingSignature.fromJsonString(decoded);
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
    ring: Point[], // ring.length = n
    signerPrivateKey: bigint,
    message: string,
    curve: Curve,
    config?: SignatureConfig,
  ): RingSignature {
    if (signerPrivateKey === 0n || signerPrivateKey >= curve.N)
      throw err.invalidParams("Signer private key cannot be 0 and must be < N");

    // check if ring is valid
    checkRing(ring, curve, true);

    // Never hash the message with evmCompatibility = true
    const messageDigest = BigInt(
      "0x" + hash([message], { ...config, evmCompatibility: false }),
    );

    const alpha = randomBigint(curve.N);

    // get the signer public key
    const signerPubKey: Point = derivePubKey(signerPrivateKey, curve);

    // check if the ring is sorted by x ascending coordinate (and y ascending if x's are equal)
    if (!isRingSorted(ring)) throw err.invalidRing("The ring is not sorted");

    // if needed, insert the user public key at the right place (sorted by x ascending coordinate)
    let signerIndex = ring.findIndex(
      (point) => point.x === signerPubKey.x && point.y === signerPubKey.y,
    );
    if (signerIndex === -1) {
      // todo: make it more efficient
      ring = ring.concat([signerPubKey]) as Point[];
      ring = sortRing(ring);
      signerIndex = ring.findIndex(
        (point) => point.x === signerPubKey.x && point.y === signerPubKey.y,
      );
    }

    if (ring.length === 0) {
      ring = [signerPubKey];
      signerIndex = 0;
    }

    // compute cpi+1
    const cpi1 = RingSignature.computeC(
      ring,
      messageDigest,
      { index: (signerIndex + 1) % ring.length, alpha: alpha },
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
      lastComputedCp = RingSignature.computeC(
        this.ring,
        messageDigest,
        {
          index: (i + 1) % this.ring.length,
          previousR: this.responses[i],
          previousC: lastComputedCp,
          previousIndex: i,
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
      signature = RingSignature.fromBase64(signature).toJsonString();
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
   * @param messageDigest - The message digest
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
    // check if ring is valid
    try {
      checkRing(ring, curve);
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
   * @see params.index - The index of the public key in the ring
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
      index: number;
      previousR?: bigint;
      previousC?: bigint;
      previousIndex?: number;
      alpha?: bigint;
    },
    curve: Curve,
    config?: SignatureConfig,
  ): bigint {
    const G = curve.GtoPoint();
    const N = curve.N;
    const hasAlphaWithoutPrevious =
      params.alpha &&
      params.previousR === undefined &&
      params.previousC === undefined &&
      params.previousIndex === undefined;
    const hasPreviousWithoutAlpha =
      !params.alpha &&
      params.previousR !== undefined &&
      params.previousC !== undefined &&
      params.previousIndex !== undefined;
    if (!(hasAlphaWithoutPrevious || hasPreviousWithoutAlpha)) {
      throw err.missingParams(
        "Either 'alpha' or all the others params must be set",
      );
    }
    if (params.alpha) {
      const alphaG = G.mult(params.alpha);
      // if !config.evmCompatibility, the ring is not added to the hash
      // if config.evmCompatibility, the message is only added in the first iteration
      const hashContent = (config?.evmCompatibility ? [] : serializeRing(ring))
        .concat(
          (config?.evmCompatibility && params.index === 1) ||
            !config?.evmCompatibility
            ? [messageDigest]
            : [],
        )
        .concat([
          config?.evmCompatibility
            ? BigInt(alphaG.toEthAddress())
            : BigInt("0x" + alphaG.serialize()),
        ]);

      return modulo(BigInt("0x" + hash(hashContent, config)), N);
    }
    if (
      params.previousR &&
      params.previousC &&
      params.previousIndex !== undefined
    ) {
      const point = G.mult(params.previousR).add(
        ring[params.previousIndex].mult(params.previousC),
      );

      const hashContent = (config?.evmCompatibility ? [] : serializeRing(ring))
        .concat(
          (config?.evmCompatibility && params.index === 1) ||
            !config?.evmCompatibility
            ? [messageDigest]
            : [],
        )
        .concat([
          config?.evmCompatibility
            ? BigInt(point.toEthAddress())
            : BigInt("0x" + point.serialize()),
        ]);

      return modulo(BigInt("0x" + hash(hashContent, config)), N);
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
  // check if the ring is empty
  if (ring.length === 0 && !emptyRing) throw err.noEmptyRing;
  if (!ref) ref = ring[0].curve;

  // check for duplicates using a set
  if (new Set(serializeRing(ring)).size !== ring.length)
    throw err.noDuplicates("ring");

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
 * Serialize a ring, i.e., serialize each point in the ring
 *
 * @param ring - The ring to serialize
 *
 * @returns The serialized ring as a string array
 */
export function serializeRing(ring: Point[]): bigint[] {
  const serializedPoints: bigint[] = [];
  for (const point of ring) {
    serializedPoints.push(publicKeyToBigInt(point.serialize())); // Call serialize() on each 'point' object
  }
  return serializedPoints;
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
  if (curve && !curve.equals(point.curve)) {
    throw err.curveMismatch();
  }
  // check if the point is on the reference curve
  if (!point.curve.isOnCurve(point)) {
    throw err.notOnCurve();
  }
}

/**
 * Sort a ring by x ascending coordinate (and y ascending if x's are equal)
 *
 * @param ring the ring to sort
 * @returns the sorted ring
 */
export function sortRing(ring: Point[]): Point[] {
  return ring.sort((a, b) => {
    if (a.x !== b.x) {
      return a.x < b.x ? -1 : 1;
    }
    return a.y < b.y ? -1 : 1;
  });
}

export function publicKeyToBigInt(publicKeyHex: string): bigint {
  // Ensure the key is stripped of the prefix and is valid
  if (
    !publicKeyHex.startsWith("02") &&
    !publicKeyHex.startsWith("03") &&
    !publicKeyHex.startsWith("ED02") &&
    !publicKeyHex.startsWith("ED03")
  ) {
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
  } else {
    return BigInt(bigint.toString() + "2" + (ed ? "3" : ""));
  }
}

// convert a BigInt to a compressed ethereum public key
export function bigIntToPublicKey(bigint: bigint): string {
  // if the bigint.toString() ends with 3, the curve is ed25519
  let ed = false;
  if (bigint.toString().endsWith("3")) {
    bigint = BigInt(bigint.toString().slice(0, -1));
    ed = true;
  }

  const parity = bigint.toString().slice(-1);
  const prefix = parity === "1" ? "03" : "02";

  bigint = BigInt(bigint.toString().slice(0, -1));
  // Convert BigInt to a hex string and pad with zeros if necessary
  let hex = bigint.toString(16);
  hex = hex.padStart(64, "0"); // Pad to ensure the hex is 64 characters long

  // Return the compressed public key with the correct prefix
  if (ed) {
    return "ED" + prefix + hex;
  } else {
    return prefix + hex;
  }
}
