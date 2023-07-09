import { keccak256 } from "js-sha3";
import { randomBigint, G, l, modulo, getRandomSecuredNumber } from "./utils";

const maxBigInt =
  0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n; // est ce que c'est un bon choix ?

export function ringSignature(
  message: string,
  anonymitySet: [bigint, bigint][],
  privateKey: bigint,
) {
  // generate random number alpha
  const alpha = randomBigint(maxBigInt);

  // randomly set the index of the signer using randomly secured function
  // Regarder si Math.random est secure ou jsi c'est du pseudo random

  const signerIndex = Math.floor(
    getRandomSecuredNumber() * anonymitySet.length,
  );

  // slice the anonimity set to add the signer's pubkey
  // what's better ? adding the signer pubkey at the end and then mix the array or doing like this ?
  const signerPubkey: [bigint, bigint] = [privateKey * G[0], privateKey * G[1]];
  const pubkeys = [signerPubkey].concat(anonymitySet);
  console.log("signerPubkey: ", signerPubkey);
  console.log("pubkeys: ", pubkeys);

  // generate fake responses
  const [responses, cSigner] = generateResponses(
    signerIndex,
    message,
    privateKey,
    alpha,
    pubkeys,
  );

  const content: string = pubkeys + message + alpha * G[0] + alpha * G[1];
  const cont = alpha * G[0] + alpha * G[1];
  console.log("content c1: ", cont);
  const cIndexSignerPlus1 = BigInt("0x" + keccak256(content));

  const cees = computeCees(
    message,
    cSigner,
    cIndexSignerPlus1,
    pubkeys,
    responses,
  );

  return [cees[0], responses];
}

export function ringSignatureVerify(
  message: string,
  anonymitySet: [bigint, bigint][],
  signature: [bigint, bigint[]],
): boolean {
  let ci = signature[1][0];
  console.log("Verif, c0: ", ci);
  for (let i = 1; i < anonymitySet.length; i++) {
    const content =
      anonymitySet +
      message +
      String(signature[1][i] * G[0]) +
      String(signature[1][i] * G[1]) +
      String(signature[1][i - 1] * G[0]) +
      String(signature[1][i - 1] * G[1]) +
      String(anonymitySet[i - 1][0] * G[0]) +
      String(anonymitySet[i - 1][1] * G[0]) +
      String(anonymitySet[i - 1][0] * G[1]) +
      String(anonymitySet[i - 1][1] * G[1]);
    if (i == 1) {
      const cont =
        String(signature[1][i] * G[0]) +
        String(signature[1][i] * G[1]) +
        String(signature[1][i - 1] * G[0]) +
        String(signature[1][i - 1] * G[1]) +
        String(anonymitySet[i - 1][0] * G[0]) +
        String(anonymitySet[i - 1][1] * G[0]) +
        String(anonymitySet[i - 1][0] * G[1]) +
        String(anonymitySet[i - 1][1] * G[1]);
      console.log("content c1 verify: ", cont);
    }
    ci = BigInt("0x" + keccak256(content));
    console.log("Verif, c" + i + ": ", ci);
  }

  return signature[0] == ci;
}

function computeCees(
  message: string,
  cSigner: bigint,
  cIndexSignerPlus1: bigint,
  anonymitySet: [bigint, bigint][],
  responses: bigint[],
): bigint[] {
  const cees: bigint[] = [cSigner, cIndexSignerPlus1];
  console.log("c0: ", cees[0]);
  console.log("c1: ", cees[1]);
  console.log("anonymitySet.length: ", anonymitySet.length);
  // For i = π + 1, π + 2, ..., n, 1, 2, ..., π − 1 calculate, replacing n + 1 → 1
  for (let i = 2; i < anonymitySet.length; i++) {
    const content: string =
      anonymitySet +
      message +
      String(responses[i] * G[0]) +
      String(responses[i] * G[1]) +
      String(cees[i - 1] * G[0]) +
      String(cees[i - 1] * G[1]) +
      String(anonymitySet[i - 1][0] * G[0]) +
      String(anonymitySet[i - 1][1] * G[0]) +
      String(anonymitySet[i - 1][0] * G[1]) +
      String(anonymitySet[i - 1][1] * G[1]);
    cees.push(BigInt("0x" + keccak256(content)));
  }
  return cees;
}

function generateResponses(
  signerIndex: number,
  message: string,
  privateKey: bigint,
  alpha: bigint,
  anonymitySet: [bigint, bigint][],
): [bigint[], bigint] {
  const responses: bigint[] = [];

  // set the number of fake responses to the size of the anonimity set.
  // The fake response of the signer will be set and the others will be random
  const m =
    String(BigInt("0x" + keccak256(message))) + alpha * G[0] + alpha * G[1];
  const c = BigInt("0x" + keccak256(m));

  const rSigner = modulo(alpha - c * privateKey, l); // alpha = (rSigner + c * privateKey) mod l
  console.log("anoni: ", anonymitySet.length);
  for (let i = 0; i < anonymitySet.length; i++) {
    if (i != signerIndex) {
      responses.push(randomBigint(maxBigInt));
    } else {
      responses.push(rSigner);
    }
  }
  console.log("responses len: ", responses.length);
  return [responses, c]; // c = cSigner
}
