"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.altSchnorrVerify = exports.altSchnorrSignature = void 0;
const js_sha3_1 = require("js-sha3"); // implementation de fonction de hashage safe ?
const utils_1 = require("../utils");
// k : private key
// K : public key = k * G
// a priori la signature et la verif ne fonctionnent pas avec des clés compressées
const maxBigInt = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
// Schnorr signature -> TODO: test if it natively works with our ring signature
function altSchnorrSignature(message, privateKey, alpha = (0, utils_1.randomBigint)(maxBigInt)) {
    console.log("hashed message: ", String(BigInt("0x" + (0, js_sha3_1.keccak256)(message))));
    const m = String(BigInt("0x" + (0, js_sha3_1.keccak256)(message))) + alpha * utils_1.G[0] + alpha * utils_1.G[1];
    console.log("m: ", m);
    // hash m
    const c = BigInt("0x" + (0, js_sha3_1.keccak256)(m));
    // define r (r = alpha - c * k)
    const r = alpha - c * privateKey;
    console.log("alpha: ", alpha);
    return [c, r];
}
exports.altSchnorrSignature = altSchnorrSignature;
const privateKey = (0, utils_1.randomBigint)(0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n);
const publicKey = [privateKey * utils_1.G[0], privateKey * utils_1.G[1]];
console.log("private key: ", privateKey);
console.log("public key: ", publicKey);
const sig = altSchnorrSignature("Hello World !", privateKey);
console.log("c: ", sig[0]);
console.log("r: ", sig[1]);
function altSchnorrVerify(message, publicKey, signature) {
    const c = signature[0];
    const r = signature[1];
    // Calculate the challenge
    const comp = [r * utils_1.G[0] + c * publicKey[0], r * utils_1.G[1] + c * publicKey[1]];
    const m = String(BigInt("0x" + (0, js_sha3_1.keccak256)(message))) +
        String(comp[0]) +
        String(comp[1]);
    console.log("challenge: ", m);
    return c == BigInt("0x" + (0, js_sha3_1.keccak256)(m));
}
exports.altSchnorrVerify = altSchnorrVerify;
console.log("Verify signature: ", altSchnorrVerify("Hello World !", publicKey, sig));
