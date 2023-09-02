// import { RingSignature, RingSig } from "../src/ringSignature";
import { RingSignature } from "../src/ringSignature";

import { G, randomBigint } from "../src/utils";

function randomRing(ringLength = 1000): [[bigint, bigint]] {
  const ring: [[bigint, bigint]] = [
    [
      randomBigint(
        0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
      ) * G[0],
      randomBigint(
        0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
      ) * G[1],
    ],
  ];

  for (let i = 0; i < ringLength - 1; i++) {
    ring.push([
      randomBigint(
        0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
      ) * G[0],
      randomBigint(
        0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
      ) * G[1],
    ]);
  }
  return ring;
}

/* TEST SIGNATURE GENERATION AND VERIFICATION */
const ring = randomRing(100);
const maxBigint =
  0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const signerPrivKey = randomBigint(maxBigint);
const r = RingSignature.sign(ring, signerPrivKey, "test");
console.log("Is sig valid ? ", r.verify());
if (!r.verify()) {
  console.log("Ring signature verification failed");
  process.exit(1);
}

/* TEST COMPUTATION TIME */
// const testRingLength = [10, 100, 500, 1000, 5000, 10000];
// console.log("\nTest ring signature generation and verification :\n");
// for (const ringLength of testRingLength) {
//   const ring = randomRing(ringLength);
//   console.log("Ring length: " + ringLength);
//   // get timestamp
//   const start = Date.now();
//   // signature and verification
//   const maxBigint =
//     0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
//   const signerPrivKey = randomBigint(maxBigint);
//   const r = RingSignature.sign(ring, signerPrivKey, "test");
//   const generationDuration = Date.now() - start;
//   console.log(" Sig generated in: " + generationDuration + "ms");
//   console.log("Is sig valid ? ", r.verify());
//   const verificationDuration = Date.now() - generationDuration - start;
//   console.log(" Sig verified in: " + verificationDuration + "ms");
//   console.log(
//     "Total time: " + (generationDuration + verificationDuration) + "ms",
//   );
//   console.log("--------------------------------------------------");
// }
// // convert the signature to an object
// const sig: RingSig = r.toRingSig();

// // object to RingSignature
// const givenSig: RingSig = RingSignature.fromRingSig(sig);
// console.log(givenSig);
