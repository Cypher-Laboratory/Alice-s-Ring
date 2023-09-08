import { keccak256 } from "js-sha3"; // implementation de fonction de hashage safe ?
import { G, randomBigint } from "../utils";

// k : private key
// K : public key = k * G

// a priori la signature et la verif ne fonctionnent pas avec des clés compressées

const maxBigInt =
  0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;

// Schnorr signature -> TODO: test if it natively works with our ring signature
export function altSchnorrSignature(
  message: string,
  privateKey: bigint,
  alpha: bigint = randomBigint(maxBigInt), // bon choix de max ?
): [bigint, bigint] {
  console.log("hashed message: ", String(BigInt("0x" + keccak256(message))));
  const m =
    String(BigInt("0x" + keccak256(message))) + alpha * G[0] + alpha * G[1];
  console.log("m: ", m);
  // hash m
  const c = BigInt("0x" + keccak256(m));

  // define r (r = alpha - c * k)
  const r = alpha - c * privateKey;
  console.log("alpha: ", alpha);
  return [c, r];
}

const privateKey =
  randomBigint(
    0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  );
const publicKey: [bigint, bigint] = [privateKey * G[0], privateKey * G[1]];
console.log("private key: ", privateKey);
console.log("public key: ", publicKey);
const sig = altSchnorrSignature("Hello World !", privateKey);
console.log("c: ", sig[0]);
console.log("r: ", sig[1]);

export function altSchnorrVerify(
  message: string,
  publicKey: [bigint, bigint],
  signature: [bigint, bigint],
): boolean {
  const c = signature[0];
  const r = signature[1];
  // Calculate the challenge
  const comp = [r * G[0] + c * publicKey[0], r * G[1] + c * publicKey[1]];
  const m =
    String(BigInt("0x" + keccak256(message))) +
    String(comp[0]) +
    String(comp[1]);
  console.log("challenge: ", m);
  return c == BigInt("0x" + keccak256(m));
}
