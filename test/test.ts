import { sign, verify } from "../src/ringSignature";
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

const r = sign(ring, 0n, "test");
console.log(verify(r, ring, "test"));
