import { randomBigint, modulo, base64Regex } from "./utils";
import { piSignature } from "./signature/piSignature";
import { derivePubKey } from "./curves";
import { Curve, Point } from ".";
import * as err from "./errors";
import { isRingSorted } from "./utils/isRingSorted";
import { keccak_256 } from "@noble/hashes/sha3";
import { u256ArrayToBytes } from "./utils";
import {
  pointToWeirstrass,
  prepare_garaga_hint,
} from "./utils/garaga_bindings";
import { IGaragaHints } from "./interfaces";

/**
 * hash a data returning the same hash between cairo and ts
 *
 *
 **/
function cairoHash(data: bigint[]): bigint {
  return BigInt(
    "0x" + Buffer.from(keccak_256(u256ArrayToBytes(data))).toString("hex"),
  );
}

function stringToBigInt(str: string): bigint {
  // Convert the string to a Uint8Array of UTF-8 encoded bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  // Convert the bytes to a hexadecimal string
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Prepend '0x' to create a hexadecimal literal and convert to BigInt
  return BigInt("0x" + hex);
}

/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 */
export class CairoRingSignature {
  private message: string; // clear message
  private c: bigint;
  private responses: bigint[];
  private ring: Point[];
  private curve: Curve;

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
  ) {
    if (ring.length === 0) throw err.noEmptyRing;

    if (ring.length != responses.length)
      throw err.lengthMismatch("ring", "responses");

    if (c >= curve.N) throw err.invalidParams("c must be a < N");

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
    return cairoHash([stringToBigInt(this.message)]);
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
  static fromJsonString(json: string | object): CairoRingSignature {
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

    try {
      const sig = parsedJson as {
        message: string;
        ring: string[];
        c: string;
        responses: string[];
        curve: string;
      };
      const curve = Curve.fromString(sig.curve);
      return new CairoRingSignature(
        sig.message,
        sig.ring.map((point: string) =>
          Point.deserialize(bigIntToPublicKey(BigInt(point))),
        ),
        BigInt(sig.c),
        sig.responses.map((response: string) => BigInt(response)),
        curve,
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
    });
  }

  /**
   * Transforms a Base64 string to a ring signature
   *
   * @param base64 - The base64 encoded signature
   *
   * @returns The ring signature
   */
  static fromBase64(base64: string): CairoRingSignature {
    // check if the base64 string is valid
    if (!base64Regex.test(base64)) throw err.invalidBase64();

    const decoded = Buffer.from(base64, "base64").toString("ascii");
    return CairoRingSignature.fromJsonString(decoded);
  }

  /**
   * Encode a ring signature to base64 string
   */
  toBase64(): string {
    return Buffer.from(this.toJsonString()).toString("base64");
  }

  static async cairoSign(
    ring: Point[], // ring.length = n
    signerPrivateKey: bigint,
    message: string,
    curve: Curve,
  ): Promise<CairoRingSignature> {
    if (signerPrivateKey === 0n || signerPrivateKey >= curve.N)
      throw err.invalidParams("Signer private key cannot be 0 and must be < N");

    // check if ring is valid
    checkRing(ring, curve, true);

    // Never hash the message with evmCompatibility = true
    const messageDigest = cairoHash([stringToBigInt(message)]);
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
    const serializedRing = serializeRingCairo(ring);
    // compute cpi+1
    const cpi1 = await CairoRingSignature.computeC(
      ring,
      serializedRing,
      messageDigest,
      { index: (signerIndex + 1) % ring.length, alpha: alpha },
      curve,
    );

    const rawSignature = await CairoRingSignature.signature(
      curve,
      ring,
      cpi1,
      signerIndex,
      messageDigest,
    );

    // compute the signer response
    const signerResponse = piSignature(
      alpha,
      rawSignature.cees[rawSignature.signerIndex],
      signerPrivateKey,
      curve,
    );

    return new CairoRingSignature(
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
  async verify(): Promise<boolean> {
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
    const messageDigest = cairoHash([stringToBigInt(this.message)]);
    const serializedRing = serializeRingCairo(this.ring);
    // NOTE : the loop has at least one iteration since the ring
    // is ensured to be not empty
    let lastComputedCp = this.c;
    // compute the c values : c1 ’, c2 ’, ... , cn ’, c0 ’
    for (let i = 0; i < this.ring.length; i++) {
      lastComputedCp = await CairoRingSignature.computeC(
        this.ring,
        serializedRing,
        messageDigest,
        {
          index: (i + 1) % this.ring.length,
          previousR: this.responses[i],
          previousC: lastComputedCp,
          previousIndex: i,
        },
        this.curve,
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
  static async verify(signature: string): Promise<boolean> {
    // check if the signature is a json or a base64 string
    if (base64Regex.test(signature)) {
      signature = CairoRingSignature.fromBase64(signature).toJsonString();
    }
    const ringSignature: CairoRingSignature =
      CairoRingSignature.fromJsonString(signature);
    return await ringSignature.verify();
  }

  async verify_garaga(): Promise<IGaragaHints[]> {
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
    const messageDigest = cairoHash([stringToBigInt(this.message)]);
    const serializedRing = serializeRingCairo(this.ring);
    // NOTE : the loop has at least one iteration since the ring
    // is ensured to be not empty
    let lastComputedCp = this.c;
    const hint: IGaragaHints[] = [];
    // compute the c values : c1 ’, c2 ’, ... , cn ’, c0 ’
    for (let i = 0; i < this.ring.length; i++) {
      const compute = await CairoRingSignature.computeCGaraga(
        this.ring,
        serializedRing,
        messageDigest,
        {
          index: (i + 1) % this.ring.length,
          previousR: this.responses[i],
          previousC: lastComputedCp,
          previousIndex: i,
        },
        this.curve,
      );
      lastComputedCp = compute.last_computed_c;
      hint.push(compute.hint);
    }

    if (this.c === lastComputedCp) {
      return hint;
    } else {
      throw Error("Invalid ring sigantrue");
    }
  }

  static async verify_garaga(signature: string): Promise<boolean> {
    // check if the signature is a json or a base64 string
    if (base64Regex.test(signature)) {
      signature = CairoRingSignature.fromBase64(signature).toJsonString();
    }
    const ringSignature: CairoRingSignature =
      CairoRingSignature.fromJsonString(signature);
    return await ringSignature.verify();
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
  private static async signature(
    curve: Curve,
    ring: Point[],
    ceePiPlusOne: bigint,
    signerIndex: number,
    messageDigest: bigint,
  ): Promise<{
    ring: Point[];
    cees: bigint[];
    signerIndex: number;
    responses: bigint[];
  }> {
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
    const serializedRing = serializeRingCairo(ring);
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
        cees[index] = await CairoRingSignature.computeC(
          ring,
          serializedRing,
          messageDigest,
          params,
          curve,
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
  private static async computeC(
    ring: Point[],
    serializedRing: bigint[],
    messageDigest: bigint,
    params: {
      index: number;
      previousR?: bigint;
      previousC?: bigint;
      previousIndex?: number;
      alpha?: bigint;
    },
    curve: Curve,
  ): Promise<bigint> {
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
      const hashContent = serializedRing.concat(messageDigest).concat(alphaG.y);

      return modulo(cairoHash(hashContent), N);
    }
    if (
      params.previousR &&
      params.previousC &&
      params.previousIndex !== undefined
    ) {
      const point = G.mult(params.previousR).add(
        ring[params.previousIndex].mult(params.previousC),
      );
      const G_weirstrass = pointToWeirstrass(G);
      const ring_weirstrass = pointToWeirstrass(ring[params.previousIndex]);
      const precompute = await prepare_garaga_hint(
        [G_weirstrass, ring_weirstrass],
        [params.previousR, params.previousC],
      );

      const hashContent = serializedRing.concat(messageDigest).concat(point.y);
      return modulo(cairoHash(hashContent), N);
    }
    throw err.missingParams(
      "Either 'alpha' or all the others params must be set",
    );
  }

  private static async computeCGaraga(
    ring: Point[],
    serializedRing: bigint[],
    messageDigest: bigint,
    params: {
      index: number;
      previousR?: bigint;
      previousC?: bigint;
      previousIndex?: number;
      alpha?: bigint;
    },
    curve: Curve,
  ): Promise<{ last_computed_c: bigint; hint: IGaragaHints }> {
    const G = curve.GtoPoint();
    const N = curve.N;
    if (
      params.previousR &&
      params.previousC &&
      params.previousIndex !== undefined
    ) {
      const point = G.mult(params.previousR).add(
        ring[params.previousIndex].mult(params.previousC),
      );
      console.log("point to weirstrass : ", pointToWeirstrass(point));
      const G_weirstrass = pointToWeirstrass(G);
      const ring_weirstrass = pointToWeirstrass(ring[params.previousIndex]);
      const precompute = await prepare_garaga_hint(
        [G_weirstrass, ring_weirstrass],
        [params.previousR, params.previousC],
      );
      const hashContent = serializedRing.concat(messageDigest).concat(point.y);
      return {
        last_computed_c: modulo(cairoHash(hashContent), N),
        hint: precompute,
      };
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
export function serializeRingCairo(ring: Point[]): bigint[] {
  const serializedPoints: bigint[] = [];
  for (const point of ring) {
    serializedPoints.push(point.y); // Call serialize() on each 'point' object
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

export function serializeRing(ring: Point[]): bigint[] {
  const serializedPoints: bigint[] = [];
  for (const point of ring) {
    serializedPoints.push(publicKeyToBigInt(point.serialize())); // Call serialize() on each 'point' object
  }
  return serializedPoints;
}

/*Data to hash :  [
  10657495649227650482807288028275287879965920379530753533351072332674903396550n,
  34408208267190262510609719821648603367379423696147372401733970751195464215177n,
  25532149091352286430307180900301885225921841363939904958011540612962878155828n,
  25130982270725351492078080917244946694662105954296899228585440574429183004137n,
  50465964246956439513629485026616137077907893571903418330307354468252175739185n,
  31501100563447797089370444184875303192304610195273019347825025349024727370472n,
  22349926047418830863286868424047153664031984048551566879408141024670517963814n,
  31521397850261351514215762853960690202016064460811530235485016346110580060958n,
  29281598888376043924944403887350209383198193855627819911092056030887793472672n,
  35304555330307088563378989364011432108154408245338297158206561833203829092972n,
  36407112948267700815706237961212238366155814822320393324467842672799158956408n,
  84425940107102072363874442480208383655871035780590271845742782040219098874582 n,
  29225814993887036894080305403416487429252652911122778133476064460051368767684n
]*/

//
//[10657495649227650482807288028275287879965920379530753533351072332674903396550,
//34408208267190262510609719821648603367379423696147372401733970751195464215177,
//25532149091352286430307180900301885225921841363939904958011540612962878155828,
//25130982270725351492078080917244946694662105954296899228585440574429183004137,
//50465964246956439513629485026616137077907893571903418330307354468252175739185,
//31501100563447797089370444184875303192304610195273019347825025349024727370472,
//22349926047418830863286868424047153664031984048551566879408141024670517963814,
//31521397850261351514215762853960690202016064460811530235485016346110580060958,
//29281598888376043924944403887350209383198193855627819911092056030887793472672,
//35304555330307088563378989364011432108154408245338297158206561833203829092972,
//36407112948267700815706237961212238366155814822320393324467842672799158956408,
//84425940107102072363874442480208383655871035780590271845742782040219098874582,
//29225814993887036894080305403416487429252652911122778133476064460051368767684]
