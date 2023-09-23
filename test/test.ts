// import { RingSignature, RingSig } from "../src/ringSignature";
import { piSignature } from "../src";
import { RingSignature } from "../src/ringSignature";
import { Curve, Point, randomBigint, SECP256K1, ED25519, modulo } from "../src/utils";

const signerPrivKey =
  25492685131648303913676486147365321410553162645346980248069629262609756314572n;

const G_SECP = new Point(Curve.SECP256K1, SECP256K1.G);
const signerPrivKey_secp = modulo(signerPrivKey, SECP256K1.N);
const ring_secp = randomRing(9, G_SECP, SECP256K1.N);

const G_ED = new Point(Curve.ED25519, ED25519.G);
const signerPrivKey_ed = modulo(signerPrivKey, ED25519.N);
const ring_ed = randomRing(9, G_ED, ED25519.N);

function randomRing(ringLength = 1000, G: Point, N: bigint): Point[] {
  let k =
    randomBigint(
      N,
    );

  const ring: Point[] = [G.mult(k)];

  for (let i = 0; i < ringLength - 1; i++) {
    k =
      randomBigint(
        N,
      );
    ring.push(G.mult(k));
  }
  return ring;
}

console.log("ring size: ", ring_ed.length + 1);

/* TEST SIGNATURE GENERATION AND VERIFICATION - SECP256K1 */
console.log("------ SIGNATURE USING SECP256K1 ------");
const signature_secp = RingSignature.sign(ring_secp, signerPrivKey_secp, "test", Curve.SECP256K1);
const verifiedSig_secp = signature_secp.verify();
console.log("Is sig valid ? ", verifiedSig_secp);

if (!verifiedSig_secp) {
  console.log("Error: Ring signature verification failed on SECP256K1");
  process.exit(1);
}

console.log("------ SIGNATURE USING ED25519 ------");
const signature_ed = RingSignature.sign(ring_ed, signerPrivKey_ed, "test", Curve.ED25519);
const verifiedSig_ed = signature_ed.verify();

console.log("Is sig valid ? ", verifiedSig_ed);

if (!verifiedSig_ed) {
  console.log("Error: Ring signature verification failed on ED25519");
  process.exit(1);
}

/*--------------------- test partial signature ---------------------*/
// console.log("------ PARTIAL SIGNATURE USING SECP256K1 ------");
// const partialSig_secp = RingSignature.partialSign(ring_secp, "test", signerPubKey_secp, Curve.SECP256K1);
// // end signing
// const signerResponse_secp = piSignature(
//   partialSig_secp.alpha,
//   partialSig_secp.c,
//   signerPrivKey_secp,
//   Curve.SECP256K1,
// );
// const sig_secp = RingSignature.combine(partialSig_secp, signerResponse_secp);
// console.log(sig_secp);

// console.log("Is partial sig valid ? ", sig_secp.verify());
// if (!sig_secp.verify()) {
//   console.log("Error: Partial signature verification failed on SECP256K1");
//   process.exit(1);
// }

// console.log("------ PARTIAL SIGNATURE USING ED25519 ------");
// const partialSig_ed = RingSignature.partialSign(ring_ed, "test", signerPubKey_ed, Curve.ED25519);
// // end signing
// const signerResponse = piSignature(
//   partialSig_ed.alpha,
//   partialSig_ed.c,
//   signerPrivKey_ed,
//   Curve.ED25519,
// );
// const sig_ed = RingSignature.combine(partialSig_ed, signerResponse);
// console.log("Is partial sig valid ? ", sig_ed.verify());
// if (!sig_ed.verify()) {
//   console.log("Error: Partial signature verification failed on ED25519");
//   process.exit(1);
// }
