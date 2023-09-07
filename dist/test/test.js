"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { RingSignature, RingSig } from "../src/ringSignature";
const ringSignature_1 = require("../src/ringSignature");
const utils_1 = require("../src/utils");
function randomRing(ringLength = 1000) {
    const ring = [
        [
            (0, utils_1.randomBigint)(0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n) * utils_1.G[0],
            (0, utils_1.randomBigint)(0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n) * utils_1.G[1],
        ],
    ];
    for (let i = 0; i < ringLength - 1; i++) {
        ring.push([
            (0, utils_1.randomBigint)(0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n) * utils_1.G[0],
            (0, utils_1.randomBigint)(0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n) * utils_1.G[1],
        ]);
    }
    return ring;
}
/* TEST SIGNATURE GENERATION AND VERIFICATION */
const ring = randomRing(100);
const maxBigint = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const signerPrivKey = (0, utils_1.randomBigint)(maxBigint);
const r = ringSignature_1.RingSignature.sign(ring, signerPrivKey, "test");
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
