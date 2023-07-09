import { altSchnorrSignature } from "./shnorrSignature/alt_Schnorr";
import { keccak256 } from "js-sha3"; // fonction de hashage reconnue ?
import { G, randomBigint, getRandomSecuredNumber } from "./utils";
import { ringSignature, ringSignatureVerify } from "./ring_signature";

const privKey =
  randomBigint(
    0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  );
let ring: [[bigint, bigint]] = [
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

const sig = ringSignature("Hello World !", ring, privKey);

const signerPubkey: [bigint, bigint] = [privKey * G[0], privKey * G[1]];
const pubkeys = [signerPubkey].concat(ring);

console.log(
  "verify: ",
  ringSignatureVerify("Hello World !", pubkeys, sig as [bigint, bigint[]]),
);
