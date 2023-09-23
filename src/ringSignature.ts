import { keccak256 } from "js-sha3";
import {
  SECP256K1,
  randomBigint,
  getRandomSecuredNumber,
  Curve,
  Point,
  modulo,
  ED25519,
} from "./utils";
import { piSignature } from "./signature/piSignature";

/**
 * Ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see cees - The first c value
 * @see responses - Responses for each public key in the ring
 */
export interface RingSig {
  message: string; // clear message
  ring: Point[];
  c: bigint;
  responses: bigint[];
  curve: Curve;
}

/**
 * Partial ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see cees - c values
 * @see responses_0_pi - Fake responses from 0 to pi-1
 * @see responses_pi_n - Fake responses from pi+1 to n
 */
export interface PartialSignature {
  message: string;
  ring: Point[];
  pi: number;
  c: bigint;
  alpha: bigint;
  signerIndex: number;
  responses: bigint[];
  curve: Curve;
}

/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 *
 * @remarks
 * For know, only SECP256K1 curve is fully supported.
 * ED25519 is on its way and then we would be able to sign using both curves at the same time
 */
export class RingSignature {
  message: string; // clear message
  c: bigint;
  responses: bigint[];
  ring: Point[];
  curve: Curve;

  /**
   * Ring signature class constructor
   *
   * @param message - Clear message to sign
   * @param ring - Ring of public keys
   * @param cees - c values
   * @param responses - Responses for each public key in the ring
   * @param curve - Curve used for the signature
   */
  constructor(
    message: string,
    ring: Point[],
    c: bigint,
    responses: bigint[],
    curve: Curve,
  ) {
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
  static fromRingSig(sig: RingSig): RingSignature {
    return new RingSignature(
      sig.message,
      sig.ring,
      sig.c,
      sig.responses,
      sig.curve,
    );
  }

  /**
   * Transform a RingSignature into a RingSig
   *
   * @returns A RingSig
   */
  toRingSig(): RingSig {
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
  static sign(
    ring: Point[], // ring.length = n
    signerPrivateKey: bigint,
    message: string,
    curve = Curve.SECP256K1,
  ): RingSignature {
    const rawSignature = RingSignature.signature(
      curve,
      ring,
      signerPrivateKey,
      message,
    );

    // compute the signer response
    const signerResponse = piSignature(
      rawSignature.alpha,
      rawSignature.cees[rawSignature.pi],
      signerPrivateKey,
      curve,
    );

    return new RingSignature(
      message,
      rawSignature.ring,
      rawSignature.cees[0],
      // insert the signer response
      rawSignature.responses
        .slice(0, rawSignature.pi)
        .concat(
          [signerResponse],
          rawSignature.responses.slice(rawSignature.pi + 1),
        ),
      curve,
    );
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
  static partialSign(
    ring: Point[], // ring.length = n
    message: string,
    signerPubKey: Point,
    curve = Curve.SECP256K1,
  ): PartialSignature {
    const rawSignature = RingSignature.signature(
      curve,
      ring,
      signerPubKey,
      message,
    );
    // console.log("rawSignature cees: ", rawSignature.cees);
    return {
      message: message,
      ring: rawSignature.ring,
      pi: rawSignature.pi,
      c: rawSignature.cees[0],
      alpha: rawSignature.alpha,
      signerIndex: rawSignature.pi,
      responses: rawSignature.responses,
      curve: curve,
    } as PartialSignature;
  }

  /**
   * Combine partial signatures into a RingSignature
   *
   * @param partialSig - Partial signatures to combine
   * @param signerResponse - Response of the signer
   *
   * @returns A RingSignature
   */
  static combine(
    partialSig: PartialSignature,
    signerResponse: bigint,
  ): RingSignature {
    return new RingSignature(
      partialSig.message,
      partialSig.ring,
      partialSig.c,
      // insert the signer response
      partialSig.responses
        .slice(0, partialSig.pi)
        .concat(
          [signerResponse],
          partialSig.responses.slice(partialSig.pi + 1),
        ),
      partialSig.curve,
    );
  }

  /**
   * Verify a RingSignature
   *
   * @returns True if the signature is valid, false otherwise
   */
  verify(): boolean {
    // we compute c1' = Hash(Ring, m, [r0G, c0K0])
    // then, for each ci (i > 1), compute ci' = Hash(Ring, message, [riG + ciKi])
    // (G = generator, K = ring public key)
    // finally, if we substitute lastC for lastC' and c0' == c0, the signature is valid

    if (this.ring.length !== this.responses.length) {
      throw new Error("ring and responses length mismatch");
    }

    let G: Point; // generator point
    let N: bigint; // order of the curve

    switch (this.curve) {
      case Curve.SECP256K1: {
        G = new Point(this.curve, SECP256K1.G);
        N = SECP256K1.N;
        break;
      }
      case Curve.ED25519: {
        G = new Point(this.curve, ED25519.G);
        N = ED25519.N;
        break;
      }
      default: {
        throw new Error("unknown curve");
      }
    }

    if (this.ring.length > 1) {
      // hash the message
      const messageDigest = keccak256(this.message);

      // computes the cees
      let lastComputedCp = modulo(
        BigInt(
          "0x" +
            keccak256(
              this.ring +
                messageDigest +
                G.mult(this.responses[0])
                  .add(this.ring[0].mult(this.c))
                  .modulo(N)
                  .toString(),
            ),
        ),
        N,
      );
      console.log(
        "c1p: ",
        G.mult(this.responses[1])
          .add(this.ring[1].mult(this.c))
          .modulo(N)
          .toString(),
      );

      for (let i = 2; i < this.ring.length; i++) {
        lastComputedCp = modulo(
          BigInt(
            "0x" +
              keccak256(
                this.ring +
                  messageDigest +
                  G.mult(this.responses[i - 1])
                    .add(this.ring[i - 1].mult(lastComputedCp))
                    .modulo(N)
                    .toString(),
              ),
          ),
          N,
        );
        console.log(
          "c" + i + "p: ",
          G.mult(this.responses[i - 1])
            .add(this.ring[i - 1].mult(lastComputedCp))
            .modulo(N)
            .toString(),
        );
      }

      // return true if c0 === c0'
      return (
        this.c ===
        modulo(
          BigInt(
            "0x" +
              keccak256(
                this.ring +
                  messageDigest +
                  G.mult(this.responses[this.responses.length - 1])
                    .add(this.ring[this.ring.length - 1].mult(lastComputedCp))
                    .modulo(N)
                    .toString(),
              ),
          ),
          N,
        )
      );
    }
    return false;
  }

  /**
   * Verify a RingSignature stored as a RingSig
   *
   * @param signature - The RingSig to verify
   * @returns True if the signature is valid, false otherwise
   */
  static verify(signature: RingSig): boolean {
    const ringSignature: RingSignature = RingSignature.fromRingSig(signature);
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
  private static signature(
    curve: Curve,
    ring: Point[],
    signerKey: Point | bigint,
    message: string,
  ) {
    let N: bigint; // order of the curve
    let G: Point; // generator point
    switch (curve) {
      case Curve.SECP256K1:
        N = SECP256K1.N;
        G = new Point(curve, SECP256K1.G);
        break;
      case Curve.ED25519:
        N = ED25519.N;
        G = new Point(Curve.ED25519, ED25519.G);
        break;
      default:
        throw new Error("unknown curve");
    }

    // hash the message
    const messageDigest = keccak256(message);

    // generate random number alpha
    const alpha = randomBigint(N);

    let signerPubKey: Point;
    if (typeof signerKey === "bigint") {
      signerPubKey = G.mult(signerKey);
    } else {
      signerPubKey = signerKey;
    }

    // set the signer position in the ring
    const pi = 1; //getRandomSecuredNumber(0, ring.length - 1); // signer index
    // add the signer public key to the ring
    ring = ring.slice(0, pi).concat([signerPubKey], ring.slice(pi)) as Point[];

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
    const responses: bigint[] = [];
    for (let i = 0; i < ring.length; i++) {
      responses.push(randomBigint(N));
    }

    // supposed to contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length)
    const cValuesPI1N: bigint[] = [];

    // compute C pi+1
    console.log("c2: ", G.mult(alpha).modulo(N).toString());
    cValuesPI1N.push(
      modulo(
        BigInt(
          "0x" +
            keccak256(
              ring + messageDigest + G.mult(alpha).modulo(N).toString(),
            ),
        ),
        N,
      ),
    );

    // compute Cpi+2 to Cn
    for (let i = pi + 2; i < ring.length; i++) {
      console.log(
        "c" + i + ": ",
        G.mult(responses[i - 1])
          .add(ring[i - 1].mult(cValuesPI1N[i - pi - 2]))
          .modulo(N)
          .toString(),
      );

      cValuesPI1N.push(
        modulo(
          BigInt(
            "0x" +
              keccak256(
                ring +
                  messageDigest +
                  G.mult(responses[i - 1])
                    .add(ring[i - 1].mult(cValuesPI1N[i - pi - 2]))
                    .modulo(N)
                    .toString(),
              ),
          ),
          N,
        ),
      );
    }

    // supposed to contains all the c from 0 to pi
    const cValues0PI: bigint[] = [];

    // compute C0
    console.log(
      "c1: ",
      G.mult(responses[responses.length - 1])
        .add(
          ring[ring.length - 1].mult(
            modulo(cValuesPI1N[cValuesPI1N.length - 1], N),
          ),
        )
        .modulo(N)
        .toString(),
    );

    cValues0PI.push(
      modulo(
        BigInt(
          "0x" +
            keccak256(
              ring +
                messageDigest +
                G.mult(responses[responses.length - 1])
                  .add(
                    ring[ring.length - 1].mult(
                      modulo(cValuesPI1N[cValuesPI1N.length - 1], N),
                    ),
                  )
                  .modulo(N)
                  .toString(),
            ),
        ),
        N,
      ),
    );

    // compute C0 to C pi -1
    for (let i = 1; i < pi + 1; i++) {
      console.log(
        "c" + i + ": ",
        G.mult(responses[i - 1])
          .add(ring[i - 1].mult(cValues0PI[i - 1]))
          .modulo(N)
          .toString(),
      );

      cValues0PI[i] = modulo(
        BigInt(
          "0x" +
            keccak256(
              ring +
                messageDigest +
                G.mult(responses[i - 1])
                  .add(ring[i - 1].mult(cValues0PI[i - 1]))
                  .modulo(N)
                  .toString(),
            ),
        ),
        N,
      );
    }

    // concatenate CValues0PI, cpi and CValuesPI1N to get all the c values
    const cees: bigint[] = cValues0PI.concat(cValuesPI1N);

    return {
      ring: ring,
      pi: pi,
      cees: cees,
      alpha: alpha,
      signerIndex: pi,
      responses: responses,
    };
  }
}
