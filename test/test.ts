import { RingSignature, RingSig } from "../src/ringSignature";
import { G, randomBigint } from "../src/utils";

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

for (let i = 0; i < 9; i++) {
  ring.push([
    randomBigint(
      0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
    ) * G[0],
    randomBigint(
      0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
    ) * G[1],
  ]);
}

// signature and verification
const r = RingSignature.sign(ring, 0n, "test");
console.log(r.verify());

// convert the signature to an object
const sig: RingSig = r.toRingSig();

// object to RingSignature
const givenSig: RingSig = RingSignature.fromRingSig(sig);
console.log(givenSig);
