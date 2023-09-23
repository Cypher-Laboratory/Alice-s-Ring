// import { RingSignature, RingSig } from "../src/ringSignature";
import { piSignature } from "../src";
import { RingSignature } from "../src/ringSignature";
import { Curve, Point, randomBigint, SECP256K1, ED25519, modulo } from "../src/utils";

const G_SECP = new Point(Curve.SECP256K1, SECP256K1.G);
const G_ED = new Point(Curve.ED25519, ED25519.G);
const signerPrivKey =
  25492685131648303913676486147365321410553162645346980248069629262609756314572n;
const signerPrivKey_secp = modulo(signerPrivKey, SECP256K1.P);
const signerPubKey_secp = G_SECP.mult(signerPrivKey_secp);
const signerPrivKey_ed = modulo(signerPrivKey, ED25519.N);
const signerPubKey_ed = G_ED.mult(signerPrivKey_ed); 
const ring_secp = randomRing(9, G_SECP, SECP256K1.P);
const ring_ed = randomRing(9, G_ED, ED25519.N);

function randomRing(ringLength = 1000, G = G_SECP, P = SECP256K1.P): Point[] {
  let k =
    randomBigint(
      P,
    );

  const ring: Point[] = [G.mult(k)];

  for (let i = 0; i < ringLength - 1; i++) {
    k =
      randomBigint(
        P,
      );
    ring.push(G.mult(k));
  }
  return ring;
}

console.log("ring size: ", ring_ed.length + 1);

/* TEST SIGNATURE GENERATION AND VERIFICATION - SECP256K1 */
console.log("------ SIGNATURE USING SECP256K1 ------");
const signature_secp = RingSignature.sign(ring_secp, signerPrivKey, "test");
console.log("Is sig valid ? ", signature_secp.verify());

if (!signature_secp.verify()) {
  console.log("Error: Ring signature verification failed on ED25519");
  process.exit(1);
}

console.log("------ SIGNATURE USING ED25519 ------");
const signature_ed = RingSignature.sign(ring_ed, signerPrivKey, "test");
console.log("Is sig valid ? ", signature_ed.verify());

if (!signature_ed.verify()) {
  console.log("Error: Ring signature verification failed");
  process.exit(1);
}

// test partial signature
console.log("------ PARTIAL SIGNATURE USING SECP256K1 ------");
const partialSig_secp = RingSignature.partialSign(ring_secp, "test", signerPubKey_secp);
// end signing
const signerResponse_secp = piSignature(
  partialSig_secp.alpha,
  partialSig_secp.cees[partialSig_secp.signerIndex],
  signerPrivKey,
  Curve.SECP256K1,
);
const sig_secp = RingSignature.combine(partialSig_secp, signerResponse_secp);
console.log("Is partial sig valid ? ", sig_secp.verify());
if (!sig_secp.verify()) {
  console.log("Error: Partial signature verification failed on SECP256K1");
  process.exit(1);
}

console.log("------ PARTIAL SIGNATURE USING ED25519 ------");
const partialSig_ed = RingSignature.partialSign(ring_secp, "test", signerPubKey_ed);
// end signing
const signerResponse = piSignature(
  partialSig_ed.alpha,
  partialSig_ed.cees[partialSig_ed.signerIndex],
  signerPrivKey_ed,
  Curve.SECP256K1,
);
const sig_ed = RingSignature.combine(partialSig_ed, signerResponse);
console.log("Is partial sig valid ? ", sig_ed.verify());
if (!sig_ed.verify()) {
  console.log("Error: Partial signature verification failed on ED25519");
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
