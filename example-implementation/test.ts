import { keccak256 } from "js-sha3";
import { G, P, modulo, mult, randomBigint } from "../src/utils";
const max = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;

// ring pubkeys
const K1 = mult(modulo(randomBigint(max), P), G);

const K3 = mult(modulo(randomBigint(max), P), G)

// signer keys
const k2 = modulo(randomBigint(max), P);
const K2 = mult(k2, G);

/* -------SIGNING------- */

// alpha
const alpha = modulo(randomBigint(max), P);

// fake responses
const r1 = modulo(randomBigint(max), P);
const r3 = modulo(randomBigint(max), P);

// pi = 2
const ring = [K1, K2, K3];
// console.log('ring: ', ring);
const message = keccak256("test");
// console.log("alpha: ", alpha);

// seed the loop
const c3 = BigInt(
  "0x" +
    keccak256(
      ring +
        message +
        String(modulo(mult(alpha, G)[0], P)) +
        String(modulo(mult(alpha, G)[1], P)),
    ),
);
console.log("c3: \n",
mult(alpha, G)[0], '\n',
mult(alpha, G)[1], '\n',
)

// Iterate:
const c1 = BigInt(
  "0x" +
    keccak256(
      ring +
        message +
        String(modulo(mult(r3, G)[0] + mult(c3, K3)[0], P)) +
        String(modulo(mult(r3, G)[1] + mult(c3, K3)[1], P)),
    ),
);

const c2 = BigInt(
  "0x" +
    keccak256(
      ring +
        message +
        String(modulo(mult(r1, G)[0] + mult(c1, K1)[0], P)) +
        String(modulo(mult(r1, G)[1] + mult(c1, K1)[1], P)),
    ),
);

// signer response
const r2 = modulo(alpha - c2 * k2, P);

// this shouldn't change the value of c3
// c3 = BigInt('0x' + keccak256(
//   ring
//   + message
//   + String(modulo(r2 * G[0], P) + modulo(c2 * K2[0], P))
//   + String(modulo(r2 * G[1], P) + modulo(c2 * K2[1], P))
// ));

/* -------VERIFICATION------- */

const c2p = BigInt(
  "0x" +
    keccak256(
      ring +
        message +
        String(modulo(mult(r1, G)[0] + mult(c1, K1)[0], P)) +
        String(modulo(mult(r1, G)[1] + mult(c1, K1)[1], P)),
    ),
);

// c2 should be equal to c2p
console.log("c2 === c2p: ", c2 === c2p);

const c3p = BigInt(
  "0x" +
    keccak256(
      ring +
        message +
        String(modulo(mult(r2, G)[0] + mult(c2p, K2)[0], P)) +
        String(modulo(mult(r2, G)[1] + mult(c2p, K2)[1], P)),
    ),

);
console.log("K2: ", K2);
console.log(modulo(mult(c2p, K2)[0] + mult(r2, G)[0], P)); // c3p
console.log(modulo(mult(modulo(alpha, P), G)[0], P)); // c3
console.log(modulo(mult(c2p, K2)[0] + mult(r2, G)[0], P) == modulo(mult(alpha, G)[0], P));

console.log("c3p: \n",
mult(r2, G)[0] + mult(c2p, K2)[0], '\n',
mult(r2, G)[1] + mult(c2p, K2)[1], '\n',
)

// c3 should be equal to c3p
console.log("c3 === c3p: ", c3 === c3p);

const c1p = BigInt(
  "0x" +
    keccak256(
      ring +
        message +
        String(modulo(mult(r3, G)[0] + mult(c3p, K3)[0], P)) +
        String(modulo(mult(r3, G)[1] + mult(c3p, K3)[1], P)),
    ),
);

// c1 should be equal to c1p
console.log("c1 === c1p: ", c1 === c1p);
// console.log('c1: \n',
//   String(modulo(r3 * G[0] + c3 * K3[0], P)), '\n',
//   String(modulo(r3 * G[1] + c3 * K3[1], P)),
// );

// console.log('c1p: \n',
//   String(modulo(r3 * G[0] + c3p * K3[0], P)), '\n',
//   String(modulo(r3 * G[1] + c3p * K3[1], P)), '\n',
// );

if (c1 === c1p) {
  console.log("Example signature is valid");
}

console.log("c1: ", c1);
console.log("c2: ", c2);
console.log("c3: ", c3);
console.log("\n");
console.log("c1p: ", c1p);
console.log("c2p: ", c2p);
console.log("c3p: ", c3p);
