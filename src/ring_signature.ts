import { keccak256 } from "js-sha3";
import { randomBigint, G, modulo } from "./utils";


const maxBigInt = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n; // est ce que c'est un bon choix ?

export function ringSignature(message: string, anonymitySet: [bigint, bigint][], privateKey: bigint, ) {
    // generate random number alpha
    const alpha = randomBigint(maxBigInt);
    
    // randomly set the index of the signer
    const signerIndex = Math.floor(Math.random() * anonymitySet.length);

    // slice the anonimity set to add the signer's pubkey
    const signerPubkey: [bigint, bigint] = [privateKey * G[0], privateKey * G[1]];
    const pubkeys = anonymitySet.slice(0, signerIndex).concat(signerPubkey).concat(anonymitySet.slice(signerIndex + 1));
    
    console.log("pubkeys: ", pubkeys);

    // generate fake responses
    const responses: bigint[] = generateResponses(signerIndex, message, privateKey, alpha, anonymitySet);

    const content: string = pubkeys + message + alpha * G[0] + alpha * G[1];
    const cIndexSignerPlus1: bigint = BigInt(keccak256(content));

    const cees = computeCees(signerIndex, message, cIndexSignerPlus1, anonymitySet, responses);

    return [cl, responses];
}


export function ringSignatureVerify(message: string, anonymitySet: [bigint, bigint][], signature: [bigint, bigint[]]): boolean {
    let ci = 0n; // c0: on met quoi ici ?

    for (let i = 1; i < anonymitySet.length; i++) {
        const content = anonymitySet + message + String(signature[1][i]*G[0]) + String(signature[1][i]*G[1]) + String(signature[1][i-1]*G[0]) + String(signature[1][i-1]*G[1]) + String(anonymitySet[i-1][0]*G[0])+ String(anonymitySet[i-1][1]*G[0]) + String(anonymitySet[i-1][0]*G[1]) + String(anonymitySet[i-1][1]*G[1]);
        ci = BigInt(keccak256(content));
    }

    return signature[0] == ci
}

function computeCees(signerIndex: number, 
    message: string,
    cIndexSignerPlus1: bigint, 
    anonymitySet: [bigint, bigint][],
    responses: bigint[],
    ): bigint[] {
    const cees: bigint[] = [cIndexSignerPlus1];
    // For i = π + 1, π + 2, ..., n, 1, 2, ..., π − 1 calculate, replacing n + 1 → 1
    for (let i = signerIndex + 2; i < anonymitySet.length; i++) {
        const content: string = anonymitySet + message + String(responses[i]*G[0]) + String(responses[i]*G[1]) + String(cees[i-1]*G[0]) + String(cees[i-1]*G[1]) + String(anonymitySet[i-1][0]*G[0])+ String(anonymitySet[i-1][1]*G[0]) + String(anonymitySet[i-1][0]*G[1]) + String(anonymitySet[i-1][1]*G[1]);
        cees.push(BigInt(keccak256(content)));
    }
    for (let i = 0; i < signerIndex; i++) {
        if(i > 0){
            const content: string = anonymitySet + message + String(responses[i]*G[0]) + String(responses[i]*G[1]) + String(cees[i-1]*G[0]) + String(cees[i-1]*G[1]) + String(anonymitySet[i-1][0]*G[0])+ String(anonymitySet[i-1][1]*G[0]) + String(anonymitySet[i-1][0]*G[1]) + String(anonymitySet[i-1][1]*G[1]);
            cees.push(BigInt(keccak256(content)));
        }
        else{
            const content: string = anonymitySet + message + String(responses[i]*G[0]) + String(responses[i]*G[1]) + String(cees[anonymitySet.length-1]*G[0]) + String(cees[anonymitySet.length-1]*G[1]) + String(anonymitySet[anonymitySet.length-1][0]*G[0])+ String(anonymitySet[anonymitySet.length-1][1]*G[0]) + String(anonymitySet[anonymitySet.length-1][0]*G[1]) + String(anonymitySet[anonymitySet.length-1][1]*G[1]);
            cees.push(BigInt(keccak256(content)));
        }
    }
    return cees;
}

function generateResponses(signerIndex: number, message: string, privateKey: bigint, alpha: bigint, anonymitySet: [bigint, bigint][]): bigint[] {
    const responses: bigint[] = [];

    // set the number of fake responses to the size of the anonimity set. 
    // The fake response of the signer will be set and the others will be random 
    const m = String(BigInt('0x' + keccak256(message))) + alpha * G[0] + alpha * G[1];
    const c = BigInt('0x' + keccak256(m));

    const l = 1n; // quelle valeur ?
    const rSigner = modulo((alpha - c * privateKey), l) ; // alpha = (rSigner + c * privateKey) mod l
    for (let i = 0; i < anonymitySet.length; i++) { 
        if(i != signerIndex){
            responses.push(randomBigint(maxBigInt));
        }
        else{
            responses.push(rSigner);
        }
    }
    return responses;
}

