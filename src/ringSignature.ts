import { keccak256 } from "js-sha3";
import {
  G,
  P,
  randomBigint,
  getRandomSecuredNumber,
  Curve,
  modulo,
  mult,
} from "./utils";
import { piSignature } from "./signature/piSignature";

/**
 * Ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see cees - c values
 * @see responses - Responses for each public key in the ring
 */
export interface RingSig {
  message: string; // clear message
  ring: [[bigint, bigint]];
  cees: bigint[];
  responses: bigint[];
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
  ring: [[bigint, bigint]];
  cees: bigint[];
  alpha: bigint;
  signerIndex: number;
  responses_0_pi: bigint[];
  responses_pi_n: bigint[];
}

/**
 * Ring signature class.
 * This class is used to sign messages using ring signatures.
 * It can also be used to verify ring signatures.
 */
export class RingSignature {
  message: string; // clear message
  cees: bigint[];
  responses: bigint[];
  ring: [[bigint, bigint]];

  /**
   * Ring signature class constructor
   *
   * @param message - Clear message to sign
   * @param ring - Ring of public keys
   * @param cees - c values
   * @param responses - Responses for each public key in the ring
   */
  constructor(
    message: string,
    ring: [[bigint, bigint]],
    cees: bigint[],
    responses: bigint[],
  ) {
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
  static fromRingSig(sig: RingSig): RingSignature {
    return new RingSignature(sig.message, sig.ring, sig.cees, sig.responses);
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
      cees: this.cees,
      responses: this.responses,
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
    ring: [[bigint, bigint]], // ring.length = n
    signerPrivKey: bigint,
    message: string,
    curve = Curve.SECP256K1,
  ): RingSignature {
    // hash the message
    const messageDigest = keccak256(message);

    // generate random number alpha
    const alpha = randomBigint(P);

    // set the signer position in the ring
    if (curve !== Curve.SECP256K1) throw new Error("Curve not supported");

    const signerPubKey = mult(signerPrivKey, G);

    const pi = 5; // getRandomSecuredNumber(0, ring.length - 1); // signer index
    console.log("pi: ", pi);
    // add the signer public key to the ring
    ring = ring.slice(0, pi).concat([signerPubKey], ring.slice(pi)) as [
      [bigint, bigint],
    ];

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
    const responses: bigint[] = [];
    for (let i = 0; i < ring.length; i++) {
      responses.push(randomBigint(P));
    }

    // supposed to contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length)
    const cValuesPI1N: bigint[] = [];

    // compute C pi+1
    let scalarTimesPoint = mult(alpha, G); // temporary variable
    cValuesPI1N.push(
      BigInt(
        "0x" +
          keccak256(
            ring +
              messageDigest +
              String(modulo(scalarTimesPoint[0], P)) +
              String(modulo(scalarTimesPoint[1], P)),
          ),
      ),
    );
    console.log("cpi+1: ", scalarTimesPoint[0], '\n', scalarTimesPoint[1]);

    // compute Cpi+2 to Cn
    for (let i = pi + 2; i < ring.length; i++) {
      scalarTimesPoint = mult(responses[i - 1],  G);
      cValuesPI1N.push(
        BigInt(
          "0x" +
            keccak256(
              ring +
                messageDigest +
                String(
                  modulo(
                    scalarTimesPoint[0] +
                      cValuesPI1N[i - pi - 2] * ring[i - 1][0],
                    P,
                  ),
                ) +
                String(
                  modulo(
                    scalarTimesPoint[0] +
                      cValuesPI1N[i - pi - 2] * ring[i - 1][1],
                    P,
                  ),
                ),
            ),
        ),
      );
    }

    // supposed to contains all the c from 0 to pi
    const cValues0PI: bigint[] = [];

    // compute C0
    scalarTimesPoint = mult(responses[responses.length - 1], G);
    cValues0PI.push(
      BigInt(
        "0x" +
          keccak256(
            ring +
              messageDigest +
              String(
                modulo(
                  scalarTimesPoint[0] +
                    cValuesPI1N[cValuesPI1N.length - 1] *
                      ring[ring.length - 1][0],
                  P,
                ),
              ) +
              String(
                modulo(
                  scalarTimesPoint[1] +
                    cValuesPI1N[cValuesPI1N.length - 1] *
                      ring[ring.length - 1][1],
                  P,
                ),
              ),
          ),
      ),
    );

    // compute C0 to C pi -1
    for (let i = 1; i < pi + 1; i++) {
      scalarTimesPoint = mult(responses[i - 1], G);
      cValues0PI[i] = BigInt(
        "0x" +
          keccak256(
            ring +
              messageDigest +
              String(
                modulo(
                  scalarTimesPoint[0] + cValues0PI[i - 1] * ring[i - 1][0],
                  P,
                ),
              ) +
              String(
                modulo(
                  scalarTimesPoint[1] + cValues0PI[i - 1] * ring[i - 1][1],
                  P,
                ),
              ),
          ),
      );
    }

    // concatenate CValues0PI, cpi and CValuesPI1N to get all the c values
    const cees: bigint[] = cValues0PI.concat(cValuesPI1N);

    // compute the signer response
    const signerResponse = piSignature(alpha, cees[pi], signerPrivKey, P);
    for (let i=0; i<cees.length; i++) {
      console.log("c"+i+": ", cees[i]);
    }

    return new RingSignature(
      message,
      ring,
      cees,
      // replace responses[pi] with the signer response
      responses.slice(0, pi).concat([signerResponse], responses.slice(pi + 1)),
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
    ring: [[bigint, bigint]], // ring.length = n
    message: string,
    signerPubKey: [bigint, bigint],
  ): PartialSignature {
    // hash the message
    const messageDigest = keccak256(message);

    // generate random number alpha
    const alpha = randomBigint(P);

    const pi = getRandomSecuredNumber(0, ring.length - 1); // signer index

    // add the signer public key to the ring
    ring = ring.slice(0, pi).concat([signerPubKey], ring.slice(pi)) as [
      [bigint, bigint],
    ];

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
    const responses: bigint[] = [];
    for (let i = 0; i < ring.length; i++) {
      responses.push(randomBigint(P));
    }

    // supposed to contains all the cees from pi+1 to n (pi+1, pi+2, ..., n)(n = ring.length)
    const cValuesPI1N: bigint[] = [];

    // compute C pi+1
    cValuesPI1N.push(
      BigInt(
        "0x" +
          keccak256(
            ring +
              messageDigest +
              String(modulo(alpha * G[0], P)) +
              String(modulo(alpha * G[1], P)),
          ),
      ),
    );

    // compute Cpi+2 to Cn
    for (let i = pi + 2; i < ring.length; i++) {
      cValuesPI1N.push(
        BigInt(
          "0x" +
            keccak256(
              ring +
                messageDigest +
                String(
                  modulo(
                    responses[i - 1] * G[0] +
                      cValuesPI1N[i - pi - 2] * ring[i - 1][0],
                    P,
                  ),
                ) +
                String(
                  modulo(
                    responses[i - 1] * G[1] +
                      cValuesPI1N[i - pi - 2] * ring[i - 1][1],
                    P,
                  ),
                ),
            ),
        ),
      );
    }

    // supposed to contains all the c from 0 to pi
    const cValues0PI: bigint[] = [];

    // compute C 0
    cValues0PI.push(
      BigInt(
        "0x" +
          keccak256(
            ring +
              messageDigest +
              String(
                modulo(
                  responses[responses.length - 1] * G[0] +
                    cValuesPI1N[cValuesPI1N.length - 1] *
                      ring[ring.length - 1][0],
                  P,
                ),
              ) +
              String(
                modulo(
                  responses[responses.length - 1] * G[1] +
                    cValuesPI1N[cValuesPI1N.length - 1] *
                      ring[ring.length - 1][1],
                  P,
                ),
              ),
          ),
      ),
    );

    // compute C0 to C pi -1
    for (let i = 1; i < pi + 1; i++) {
      cValues0PI[i] = BigInt(
        "0x" +
          keccak256(
            ring +
              messageDigest +
              String(
                modulo(
                  responses[i - 1] * G[0] + cValues0PI[i - 1] * ring[i - 1][0],
                  P,
                ),
              ) +
              String(
                modulo(
                  responses[i - 1] * G[1] + cValues0PI[i - 1] * ring[i - 1][1],
                  P,
                ),
              ),
          ),
      );
    }

    // concatenate CValues0PI, cpi and CValuesPI1N to get all the c values
    const cees: bigint[] = cValues0PI.concat(cValuesPI1N);

    return {
      message: message,
      ring: ring,
      cees: cees,
      alpha: alpha,
      signerIndex: pi,
      responses_0_pi: responses.slice(0, pi),
      responses_pi_n: responses.slice(pi, responses.length),
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
      partialSig.cees,
      partialSig.responses_0_pi.concat(
        signerResponse,
        partialSig.responses_pi_n,
      ),
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
    // finally, if we substitute lastC for lastC' and c0' = c0, the signature is valid

    if (this.ring.length > 1) {
      // hash the message
      const messageDigest = keccak256(this.message);

      // computes the cees
      let scalarTimesPoint = mult(this.responses[0], G);
      let lastComputedCp = BigInt(
        "0x" +
          keccak256(
            this.ring +
              messageDigest +
              String(
                modulo(
                  scalarTimesPoint[0] + this.cees[0] * this.ring[0][0],
                  P,
                ),
              ) +
              String(
                modulo(
                  scalarTimesPoint[1] + this.cees[0] * this.ring[0][1],
                  P,
                ),
              ),
          ),
      );
      console.log("c1': ", lastComputedCp);
      for (let i = 2; i < this.ring.length; i++) {
        scalarTimesPoint = mult(this.responses[i - 1], G);
        lastComputedCp = BigInt(
          "0x" +
            keccak256(
              this.ring +
                messageDigest +
                String(
                  modulo(
                    scalarTimesPoint[0] +
                      lastComputedCp * this.ring[i - 1][0],
                    P,
                  ),
                ) +
                String(
                  modulo(
                    scalarTimesPoint[1] +
                      lastComputedCp * this.ring[i - 1][1],
                    P,
                  ),
                ),
            ),
        );
        if(i == 6){
          console.log("c'pi+1 : ", 
          scalarTimesPoint[0] +
                      lastComputedCp * this.ring[i - 1][0] + '\n' +
                      scalarTimesPoint[1] +
                      lastComputedCp * this.ring[i - 1][1]
                      );
        }
        console.log("c'" + i + ': ', lastComputedCp);
      }

      // return true if c0 === c0'
      scalarTimesPoint = mult(this.responses[this.responses.length - 1], G);
      return (
        this.cees[0] ===
        BigInt(
          "0x" +
            keccak256(
              this.ring +
                messageDigest +
                String(
                  modulo(
                    scalarTimesPoint[0] +
                      lastComputedCp * this.ring[this.ring.length - 1][0],
                    P,
                  ),
                ) +
                String(
                  modulo(
                    scalarTimesPoint[1] +
                      lastComputedCp * this.ring[this.ring.length - 1][1],
                    P,
                  ),
                ),
            ),
        )
      );
    }
    return false;
  }
}
