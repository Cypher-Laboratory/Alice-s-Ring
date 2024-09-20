import {
  derivePubKey,
  SignatureConfig,
  ecHash,
  HashFunction,
  Curve,
  Point,
  randomBigint,
  mod,
  hash,
  base64Regex,
  piSignature,
  isRingSorted,
  errors as err,
  serializeRing,
  sortRing,
  checkRing,
} from "@cypher-laboratory/ring-sig-utils";

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
  private keyImage: Point;
  private linkabilityFlag: string;
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
    keyImage: Point,
    linkabilityFlag: string,
    config?: SignatureConfig,
  ) {
    if (ring.length === 0) throw err.noEmptyRing;

    if (ring.length != responses.length)
      throw err.lengthMismatch("ring", "responses");

    if (c >= curve.N) throw err.invalidParams("c must be a < N");

    // check if config is an object
    if (config && typeof config !== "object")
      throw err.invalidParams("Config must be an object");

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
    this.keyImage = keyImage;
    this.linkabilityFlag = linkabilityFlag;
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
   * Get the key image
   *
   * @returns The key image
   */
  getKeyImage(): Point {
    return this.keyImage;
  }

  /**
   * Get the linkability flag
   *
   * @returns The linkability flag
   */
  getLinkabilityFlag(): string {
    return this.linkabilityFlag;
  }

  /**
   * Get the message digest
   *
   * @returns The message digest
   */
  get messageDigest(): bigint {
    return BigInt("0x" + hash([this.message], { ...this.config }));
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
    console.log("before try");
    try {
      const sig = parsedJson as {
        message: string;
        ring: string[];
        c: string;
        responses: string[];
        curve: string;
        keyImage: string;
        linkabilityFlag: string;
        config?: SignatureConfig;
      };
      const curve = Curve.fromString(sig.curve);
      return new RingSignature(
        sig.message,
        sig.ring.map((point: string) => Point.deserialize(point)),
        BigInt("0x" + sig.c),
        sig.responses.map((response: string) => BigInt("0x" + response)),
        curve,
        Point.deserialize(sig.keyImage),
        sig.linkabilityFlag,
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
      ring: serializeRing(this.ring),
      c: this.c.toString(16),
      responses: this.responses.map((response) => response.toString(16)),
      curve: this.curve.toString(),
      keyImage: this.keyImage.serialize(),
      linkabilityFlag: this.linkabilityFlag,
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
   * @param linkabilityFlag - The linkability flag to use (fix the key image into a context to avoid leaking the global key image)
   * @param config - The config params to use
   *
   * @returns A RingSignature
   */
  static sign(
    ring: Point[], // ring.length = n
    signerPrivateKey: bigint,
    message: string,
    curve: Curve,
    linkabilityFlag: string,
    config?: SignatureConfig,
  ): RingSignature {
    if (signerPrivateKey === 0n || signerPrivateKey >= curve.N)
      throw err.invalidParams("Signer private key cannot be 0 and must be < N");

    // check if ring is valid
    checkRing(ring, curve, true);

    const messageDigest = BigInt("0x" + hash([message], { ...config }));

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

    const customMapped = ecHash(
      [signerPubKey.serialize()].concat(
        linkabilityFlag !== "" ? [linkabilityFlag] : [],
      ),
      curve,
      // config,
    );

    const keyImage = customMapped.mult(signerPrivateKey);
    const serializedRing = serializeRing(ring);
    // compute cpi+1
    const cpi1 = RingSignature.computeC(
      ring,
      serializedRing,
      messageDigest,
      {
        index: (signerIndex + 1) % ring.length,
        alpha: alpha,
        customMapped: customMapped,
      },
      curve,
      config,
    );

    const rawSignature = RingSignature.signature(
      curve,
      ring,
      cpi1,
      signerIndex,
      messageDigest,
      keyImage,
      linkabilityFlag,
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
      keyImage,
      linkabilityFlag,
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

    const serializedRing = serializeRing(this.ring);
    // compute the c values : c1 ’, c2 ’, ... , cn ’, c0 ’
    for (let i = 0; i < this.ring.length; i++) {
      const c = RingSignature.computeC(
        this.ring,
        serializedRing,
        messageDigest,
        {
          index: (i + 1) % this.ring.length,
          previousR: this.responses[i],
          previousC: lastComputedCp,
          previousIndex: i,
          keyImage: this.keyImage,
          linkabilityFlag: this.linkabilityFlag,
        },
        this.curve,
        this.config,
      );

      lastComputedCp = c;
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
    keyImage: Point,
    linkabilityFlag: string,
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
    const serializedRing = serializeRing(ring);
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
          keyImage: keyImage,
          linkabilityFlag: linkabilityFlag,
        };
        // compute the c value
        const c = RingSignature.computeC(
          ring,
          serializedRing,
          messageDigest,
          params,
          curve,
          config,
        );

        cees[index] = c;
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
  static computeC(
    ring: Point[],
    serializedRing: string[],
    messageDigest: bigint,
    params: {
      index: number;
      previousR?: bigint;
      previousC?: bigint;
      previousIndex?: number;
      alpha?: bigint;
      customMapped?: Point;
      linkabilityFlag?: string;
      keyImage?: Point;
    },
    curve: Curve,
    config?: SignatureConfig,
  ): bigint {
    const G = curve.GtoPoint();
    const N = curve.N;
    const hasAlphaWithoutPrevious =
      params.alpha &&
      params.customMapped &&
      params.previousR === undefined &&
      params.previousC === undefined &&
      params.previousIndex === undefined;
    const hasPreviousWithoutAlpha =
      !params.alpha &&
      params.linkabilityFlag !== undefined &&
      params.keyImage !== undefined &&
      params.previousR !== undefined &&
      params.previousC !== undefined &&
      params.previousIndex !== undefined;

    if (!(hasAlphaWithoutPrevious || hasPreviousWithoutAlpha)) {
      throw err.missingParams(
        "Either 'alpha' or all the others params must be set",
      );
    }
    if (params.alpha && params.customMapped) {
      const alphaG = G.mult(params.alpha);

      const hashContent = (serializedRing as (bigint | string)[])
        .concat([messageDigest])
        .concat([alphaG.serialize()])
        .concat(params.customMapped.mult(params.alpha).serialize());

      return mod(BigInt("0x" + hash(hashContent, config)), N);
    }
    if (
      params.previousR &&
      params.previousC &&
      params.previousIndex !== undefined &&
      params.linkabilityFlag &&
      params.keyImage
    ) {
      const point = G.mult(params.previousR).add(
        ring[params.previousIndex].mult(params.previousC),
      );

      const mapped = ecHash(
        [ring[params.previousIndex].serialize()].concat(
          params.linkabilityFlag !== "" ? [params.linkabilityFlag] : [],
        ),
        curve,
      );

      const hashContent: (bigint | string)[] = (
        serializedRing as (bigint | string)[]
      )
        .concat([messageDigest])
        .concat([point.serialize()])
        .concat(
          mapped
            .mult(params.previousR)
            .add(params.keyImage.mult(params.previousC))
            .serialize(),
        );

      return mod(BigInt("0x" + hash(hashContent, config)), N);
    }
    throw err.missingParams(
      "Either 'alpha' or all the others params must be set",
    );
  }
}
