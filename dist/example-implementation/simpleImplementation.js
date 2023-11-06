"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_sha3_1 = require("js-sha3");
const utils_1 = require("../src/utils");
const curves_1 = require("../src/curves");
const point_1 = require("../src/point");
const src_1 = require("../src");
const secp256k1 = new curves_1.Curve(curves_1.CurveName.SECP256K1);
const P = secp256k1.P;
const G = new point_1.Point(secp256k1, secp256k1.G);
// ring pubkeys
const K1 = G.mult((0, utils_1.randomBigint)(P));
const K3 = G.mult((0, utils_1.randomBigint)(P));
// signer keys
const k2 = (0, utils_1.randomBigint)(P);
const K2 = G.mult(k2);
/* -------SIGNING------- */
// alpha
const alpha = (0, utils_1.randomBigint)(P);
// fake responses
const r1 = (0, utils_1.randomBigint)(P);
const r3 = (0, utils_1.randomBigint)(P);
// pi = 2
const ring = [K1, K2, K3];
// console.log('ring: ', ring);
const message = (0, js_sha3_1.keccak256)("test");
// console.log("alpha: ", alpha);
// seed the loop
const c3 = BigInt("0x" + (0, js_sha3_1.keccak256)(ring + message + G.mult(alpha).toString()));
console.log("c3: \n", G.mult(alpha), "\n");
// Iterate:
const c1 = BigInt("0x" + (0, js_sha3_1.keccak256)(ring + message + G.mult(r3).add(K3.mult(c3)).toString()));
const c2 = BigInt("0x" + (0, js_sha3_1.keccak256)(ring + message + G.mult(r1).add(K1.mult(c1)).toString()));
// signer response
const r2 = (0, src_1.piSignature)(alpha, c2, k2, secp256k1);
// this shouldn't change the value of c3
// c3 = BigInt('0x' + keccak256(
//   ring
//   + message
//   + String(modulo(r2 * G[0], P) + modulo(c2 * K2[0], P))
//   + String(modulo(r2 * G[1], P) + modulo(c2 * K2[1], P))
// ));
/* -------VERIFICATION------- */
const c2p = BigInt("0x" + (0, js_sha3_1.keccak256)(ring + message + G.mult(r1).add(K1.mult(c1)).toString()));
// c2 should be equal to c2p
console.log("c2 === c2p: ", c2 === c2p);
const c3p = BigInt("0x" + (0, js_sha3_1.keccak256)(ring + message + G.mult(r2).add(K2.mult(c2p)).toString()));
// c3 should be equal to c3p
console.log("c3 === c3p: ", c3 === c3p);
const c1p = BigInt("0x" + (0, js_sha3_1.keccak256)(ring + message + G.mult(r3).add(K3.mult(c3p)).toString()));
console.log("c1: ", c1);
console.log("c2: ", c2);
console.log("c3: ", c3);
console.log("\n");
console.log("c1p: ", c1p);
console.log("c2p: ", c2p);
console.log("c3p: ", c3p);
console.log("\n");
// c1 should be equal to c1p
console.log("c1 === c1p: ", c1 === c1p);
if (c1 === c1p) {
    console.log("Example signature is valid");
}
