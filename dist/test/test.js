"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { RingSignature, RingSig } from "../src/ringSignature";
const src_1 = require("../src");
const ringSignature_1 = require("../src/ringSignature");
const utils_1 = require("../src/utils");
const G = new utils_1.Point(utils_1.Curve.SECP256K1, utils_1.SECP256K1.G);
function randomRing(ringLength = 1000) {
    let k = (0, utils_1.randomBigint)(0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n);
    const ring = [G.mult(k)];
    for (let i = 0; i < ringLength - 1; i++) {
        k =
            (0, utils_1.randomBigint)(0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n);
        ring.push(G.mult(k));
    }
    return ring;
}
/* TEST SIGNATURE GENERATION AND VERIFICATION */
const ring = randomRing(10);
const signerPrivKey = 25492685131648303913676486147365321410553162645346980248069629262609756314572n;
const signerPubKey = G.mult(signerPrivKey);
const signature = ringSignature_1.RingSignature.sign(ring, signerPrivKey, "test");
console.log("Is sig valid ? ", signature.verify());
console.log("ring size: ", signature.ring.length);
if (!signature.verify()) {
    console.log("Error: Ring signature verification failed");
    process.exit(1);
}
// test partial signature
const partialSig = ringSignature_1.RingSignature.partialSign(ring, "test", signerPubKey);
// end signing
const signerResponse = (0, src_1.piSignature)(partialSig.alpha, partialSig.cees[partialSig.signerIndex], signerPrivKey, utils_1.Curve.SECP256K1);
const sig = ringSignature_1.RingSignature.combine(partialSig, signerResponse);
console.log("Is partial sig valid ? ", sig.verify());
if (!sig.verify()) {
    console.log("Error: Partial signature verification failed");
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
// function randomRing(ringLength = 1000): [[bigint, bigint]] {
//   let k = randomBigint(
//     0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
//   );
//   const ring: [[bigint, bigint]] = [getPublicKey(k, Curve.SECP256K1)];
//   for (let i = 0; i < ringLength - 1; i++) {
//     k = randomBigint(
//       0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
//     );
//     ring.push(getPublicKey(k, Curve.SECP256K1));
//   }
//   return ring;
// }
