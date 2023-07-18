import { keccak256 } from "js-sha3";
import { G, P, modulo, randomBigint } from "./utils";

interface IRingSignature {
  cees: bigint[];
  responses: bigint[];
}


export class RingSignature {
  cees: bigint[];
  responses: bigint[];
  constructor(cees: bigint[], responses: bigint[]) {
    this.cees = cees;
    this.responses = responses;
  }

  static fromIRingSignature(sig: IRingSignature): RingSignature {
    return new RingSignature(
      sig.cees.map((x) => BigInt("0x" + x)),
      sig.responses,
    );
  }


}



export function sign(
  witnesses: [[bigint, bigint]],
  signerPk: bigint,
  message: string,
): IRingSignature {
  // generate random number alpha
  const alpha = randomBigint(P);

  // TODO: randomly set the index of the signer using randomly secured function
  const pi = 6; // signer index
  //random response for everybody except the signer
  const fakeResponses: bigint[] = [];
  for (let i = 0; i < witnesses.length; i++) {
    fakeResponses.push(randomBigint(P));
  }

  // contains all the c from pi+1 to n
  const cValuesPI1N: bigint[] = [];
  // calcul of C pi+1
  cValuesPI1N.push(
    BigInt("0x" +
      keccak256(
        witnesses + message + String(alpha * G[0]) + String(alpha * G[1]),
      ),
    )
  );

  for (let i = pi + 2; i < witnesses.length; i++) {
    cValuesPI1N.push(
      BigInt("0x" +
        keccak256(
          witnesses +
            message +
            String(
              fakeResponses[i] * G[0] +
                BigInt("0x" + cValuesPI1N[i - pi - 2]) * witnesses[i][0] +
                BigInt("0x" + cValuesPI1N[i - pi - 2]) * witnesses[i][1] +
                fakeResponses[i] * G[1],
            ),
        ),
      )
    );
  }
  //contains all the c from 0 to pi-1
  const cValues0PI1: bigint[] = [];

  cValues0PI1.push(
    BigInt("0x" +
      keccak256(
        witnesses +
          message +
          String(
            fakeResponses[witnesses.length - 1] * G[0] +
              BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
                witnesses[witnesses.length - 1][0] +
              BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
                witnesses[witnesses.length - 1][1] +
              fakeResponses[witnesses.length - 1] * G[1],
          ),
      )
    ),
  );

  for (let i = 1; i < pi + 1; i++) {
    cValues0PI1[i] = BigInt("0x" + 
      keccak256(
        witnesses +
          message +
          String(
            fakeResponses[i] * G[0] +
              BigInt("0x" + cValues0PI1[i - 1]) * witnesses[i][0] +
              BigInt("0x" + cValues0PI1[i - 1]) * witnesses[i][1] +
              fakeResponses[i] * G[1],
          ),
      )
    );
  }

  //concatenate CVAlues0PI1 and CVAluesPI1N
  const cValues: bigint[] = cValues0PI1.concat(cValuesPI1N);

  //define the signer response
  const signerResponse = modulo(
    alpha - BigInt("0x" + cValues[pi]) * signerPk,
    P,
  ); //module L, quelle est la valeur de L ?

  return {
    cees: cValues,
    responses: fakeResponses
      .slice(0, pi)
      .concat([signerResponse])
      .concat(fakeResponses.slice(pi, fakeResponses.length)),
  };
}

export function verify(
  sig: IRingSignature,
  witnesses: [[bigint, bigint]],
  message: string,
) {
  const values: string[] = []; //contains all the c from 1 to n

  for (let i = 1; i < witnesses.length; i++) {
    values.push(
      keccak256(
        witnesses +
          message +
          String(
            sig.responses[i - 1] * G[0] +
              BigInt("0x" + sig.cees[i - 1]) * witnesses[i - 1][0] +
              BigInt("0x" + sig.cees[i - 1]) * witnesses[i - 1][1] +
              sig.responses[i - 1] * G[1],
          ),
      ),
    );
  }

  const firstValue: bigint = 
  BigInt("0x" +
    keccak256(
      witnesses +
        message +
        String(
          sig.responses[sig.responses.length - 1] * G[0] +
            BigInt("0x" + sig.cees[sig.cees.length - 1]) *
              witnesses[witnesses.length - 1][0] +
            BigInt("0x" + sig.cees[sig.cees.length - 1]) *
              witnesses[witnesses.length - 1][1] +
            sig.responses[sig.responses.length - 1] * G[1],
        ),
    ),
  );

  return firstValue === sig.cees[0];
}
