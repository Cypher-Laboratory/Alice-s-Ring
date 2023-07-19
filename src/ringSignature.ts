import { keccak256 } from "js-sha3";
import { G, P, modulo, randomBigint } from "./utils";

export interface RingSig {
  message: string; // clear message
  ring: [[bigint, bigint]];
  cees: bigint[];
  responses: bigint[];
}


export class RingSignature {
  message: string; // clear message
  cees: bigint[];
  responses: bigint[];
  ring: [[bigint, bigint]];
   

  constructor(message: string, ring: [[bigint, bigint]], cees: bigint[], responses: bigint[]) {
    this.ring = ring;
    this.message = message;
    this.cees = cees;
    this.responses = responses;
  }

  static fromRingSig(sig: RingSig): RingSignature {
    return new RingSignature(
      sig.message,
      sig.ring,
      sig.cees,
      sig.responses,
    );
  }

  toRingSig(): RingSig {
    return {
      message: this.message,
      ring: this.ring,
      cees: this.cees,
      responses: this.responses,
    };
  }

  static sign(
    ring: [[bigint, bigint]],
    signerPk: bigint,
    message: string,
  ): RingSignature {
    // generate random number alpha
    const alpha = randomBigint(P);
  
    // TODO: randomly set the index of the signer using randomly secured function
    const pi = 6; // signer index
    //random response for everybody except the signer
    const fakeResponses: bigint[] = [];
    for (let i = 0; i < ring.length; i++) {
      fakeResponses.push(randomBigint(P));
    }
  
    // contains all the c from pi+1 to n
    const cValuesPI1N: bigint[] = [];
    // calcul of C pi+1
    cValuesPI1N.push(
      BigInt("0x" +
        keccak256(
          ring + message + String(alpha * G[0]) + String(alpha * G[1]),
        ),
      )
    );
  
    for (let i = pi + 2; i < ring.length; i++) {
      cValuesPI1N.push(
        BigInt("0x" +
          keccak256(
            ring +
              message +
              String(
                fakeResponses[i] * G[0] +
                  BigInt("0x" + cValuesPI1N[i - pi - 2]) * ring[i][0] +
                  BigInt("0x" + cValuesPI1N[i - pi - 2]) * ring[i][1] +
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
          ring +
            message +
            String(
              fakeResponses[ring.length - 1] * G[0] +
                BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
                  ring[ring.length - 1][0] +
                BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
                  ring[ring.length - 1][1] +
                fakeResponses[ring.length - 1] * G[1],
            ),
        )
      ),
    );
  
    for (let i = 1; i < pi + 1; i++) {
      cValues0PI1[i] = BigInt("0x" + 
        keccak256(
          ring +
            message +
            String(
              fakeResponses[i] * G[0] +
                BigInt("0x" + cValues0PI1[i - 1]) * ring[i][0] +
                BigInt("0x" + cValues0PI1[i - 1]) * ring[i][1] +
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
  
    return new RingSignature(
      message,
      ring,
      cValues,
      fakeResponses
        .slice(0, pi)
        .concat([signerResponse])
        .concat(fakeResponses.slice(pi, fakeResponses.length)),
    );
  }

  verify(
  ) {
    const values: string[] = []; //contains all the c from 1 to n
  
    for (let i = 1; i < this.ring.length; i++) {
      values.push(
        keccak256(
          this.ring +
          this.message +
            String(
              this.responses[i - 1] * G[0] +
                BigInt("0x" + this.cees[i - 1]) * this.ring[i - 1][0] +
                BigInt("0x" + this.cees[i - 1]) * this.ring[i - 1][1] +
                this.responses[i - 1] * G[1],
            ),
        ),
      );
    }
  
    const firstValue: bigint = 
    BigInt("0x" +
      keccak256(
        this.ring +
        this.message +
          String(
            this.responses[this.responses.length - 1] * G[0] +
              BigInt("0x" + this.cees[this.cees.length - 1]) *
              this.ring[this.ring.length - 1][0] +
              BigInt("0x" + this.cees[this.cees.length - 1]) *
              this.ring[this.ring.length - 1][1] +
                this.responses[this.responses.length - 1] * G[1],
          ),
      ),
    );
  
    return firstValue === this.cees[0];
  }
  

}



// export function sign(
//   ring: [[bigint, bigint]],
//   signerPk: bigint,
//   message: string,
// ): RingSig {
//   // generate random number alpha
//   const alpha = randomBigint(P);

//   // TODO: randomly set the index of the signer using randomly secured function
//   const pi = 6; // signer index
//   //random response for everybody except the signer
//   const fakeResponses: bigint[] = [];
//   for (let i = 0; i < ring.length; i++) {
//     fakeResponses.push(randomBigint(P));
//   }

//   // contains all the c from pi+1 to n
//   const cValuesPI1N: bigint[] = [];
//   // calcul of C pi+1
//   cValuesPI1N.push(
//     BigInt("0x" +
//       keccak256(
//         ring + message + String(alpha * G[0]) + String(alpha * G[1]),
//       ),
//     )
//   );

//   for (let i = pi + 2; i < ring.length; i++) {
//     cValuesPI1N.push(
//       BigInt("0x" +
//         keccak256(
//           ring +
//             message +
//             String(
//               fakeResponses[i] * G[0] +
//                 BigInt("0x" + cValuesPI1N[i - pi - 2]) * ring[i][0] +
//                 BigInt("0x" + cValuesPI1N[i - pi - 2]) * ring[i][1] +
//                 fakeResponses[i] * G[1],
//             ),
//         ),
//       )
//     );
//   }
//   //contains all the c from 0 to pi-1
//   const cValues0PI1: bigint[] = [];

//   cValues0PI1.push(
//     BigInt("0x" +
//       keccak256(
//         ring +
//           message +
//           String(
//             fakeResponses[ring.length - 1] * G[0] +
//               BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
//                 ring[ring.length - 1][0] +
//               BigInt("0x" + cValuesPI1N[cValuesPI1N.length - 1]) *
//                 ring[ring.length - 1][1] +
//               fakeResponses[ring.length - 1] * G[1],
//           ),
//       )
//     ),
//   );

//   for (let i = 1; i < pi + 1; i++) {
//     cValues0PI1[i] = BigInt("0x" + 
//       keccak256(
//         ring +
//           message +
//           String(
//             fakeResponses[i] * G[0] +
//               BigInt("0x" + cValues0PI1[i - 1]) * ring[i][0] +
//               BigInt("0x" + cValues0PI1[i - 1]) * ring[i][1] +
//               fakeResponses[i] * G[1],
//           ),
//       )
//     );
//   }

//   //concatenate CVAlues0PI1 and CVAluesPI1N
//   const cValues: bigint[] = cValues0PI1.concat(cValuesPI1N);

//   //define the signer response
//   const signerResponse = modulo(
//     alpha - BigInt("0x" + cValues[pi]) * signerPk,
//     P,
//   ); //module L, quelle est la valeur de L ?

//   return {
//     cees: cValues,
//     responses: fakeResponses
//       .slice(0, pi)
//       .concat([signerResponse])
//       .concat(fakeResponses.slice(pi, fakeResponses.length)),
//   };
// }

// export function verify(
//   sig: RingSig,
//   ring: [[bigint, bigint]],
//   message: string,
// ) {
//   const values: string[] = []; //contains all the c from 1 to n

//   for (let i = 1; i < ring.length; i++) {
//     values.push(
//       keccak256(
//         ring +
//           message +
//           String(
//             sig.responses[i - 1] * G[0] +
//               BigInt("0x" + sig.cees[i - 1]) * ring[i - 1][0] +
//               BigInt("0x" + sig.cees[i - 1]) * ring[i - 1][1] +
//               sig.responses[i - 1] * G[1],
//           ),
//       ),
//     );
//   }

//   const firstValue: bigint = 
//   BigInt("0x" +
//     keccak256(
//       ring +
//         message +
//         String(
//           sig.responses[sig.responses.length - 1] * G[0] +
//             BigInt("0x" + sig.cees[sig.cees.length - 1]) *
//               ring[ring.length - 1][0] +
//             BigInt("0x" + sig.cees[sig.cees.length - 1]) *
//               ring[ring.length - 1][1] +
//             sig.responses[sig.responses.length - 1] * G[1],
//         ),
//     ),
//   );

//   return firstValue === sig.cees[0];
// }
