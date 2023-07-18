import {
    keccak256
} from "js-sha3";
import {
    randomBigint,
    P,
    G,
    l,
    modulo,
    getRandomSecuredNumber
} from "./utils";

/*const maxBigInt =
  0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n; // est ce que c'est un bon choix ?
*/

const maxBigInt = P;
export function ringSignature(
    message: string,
    anonymitySet: [bigint, bigint][],
    privateKey: bigint,
) {
    // generate random number alpha
    const alpha = randomBigint(maxBigInt);

    // randomly set the index of the signer using randomly secured function

    /*const signerIndex = Math.floor(
        getRandomSecuredNumber() * anonymitySet.length,
    );*/
    //add the signer pubkey to the anonymity set
    anonymitySet.push([privateKey * G[0], privateKey * G[1]]);
    const signerIndex = anonymitySet.length - 1;
    if (BigInt(signerIndex) !== privateKey) {
        // slice the anonimity set to add the signer's pubkey
        // what's better ? adding the signer pubkey at the end and then mix the array or doing like this ?
        const signerPubkey: [bigint, bigint] = [privateKey * G[0], privateKey * G[1]];
        const pubkeys = [signerPubkey].concat(anonymitySet);
        /*console.log("signerPubkey: ", signerPubkey);
        console.log("pubkeys: ", pubkeys);*/
        let fakeResponses: bigint[] = [];

        // generate responses
        for (let i = 0; i < pubkeys.length; i++) {
            const ringPK = randomBigint(maxBigInt);
            if (i !== signerIndex) {
                const m = String(BigInt(message) + alpha * G[0] + alpha * G[1]);
                const c = BigInt("0x" + keccak256(m));
                const rSigner = modulo(alpha - c * ringPK, P);
                fakeResponses.push(rSigner);
            }
        }

        // calcul of C pi+1
        let cValues: string[] = [];
        if (signerIndex === anonymitySet.length - 1) {
            cValues[0] = keccak256(anonymitySet + message + alpha * G[0] + alpha * G[1]);
            console.log(cValues[0])
            console.log(signerIndex)
        } else {
            cValues[signerIndex + 1] = keccak256(anonymitySet + message + alpha * G[0] + alpha * G[1]);
        }

        // calcul of C pi+2 to n
        for (let j = signerIndex + 2; j < anonymitySet.length; j++) {
            console.log(j)
            cValues[j] = keccak256(anonymitySet + message + fakeResponses[j - 1] * G[0] + fakeResponses[j - 1] * G[1] + BigInt(cValues[j - 1]) * pubkeys[j][0] + BigInt(cValues[j - 1]) * pubkeys[j][1]);

        }

        // calcul of C 1 to pi-1
        for (let i = 0; i < signerIndex; i++) {
            if (i !== signerIndex) {
                console.log(i)
                //cValues[i] = keccak256(anonymitySet+message+fakeResponses[signerIndex-i]*G[0]+fakeResponses[signerIndex-i]*G[1]+BigInt(cValues[signerIndex-i])*pubkeys[i][0]+BigInt(cValues[signerIndex-i])*pubkeys[i][1]);
            }
        }

        // calcul of C pi
        const m = String(BigInt(message) + alpha * G[0] + alpha * G[1]);
        const c = BigInt("0x" + keccak256(m));
        const rSigner = modulo(alpha - c * privateKey, P);
        cValues[signerIndex] = String(rSigner);

        return {
            "cvalue": cValues[0],
            "responses": fakeResponses,
            "ring": anonymitySet
        };

        /*





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

                return [cees[0], responses];*/
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
            String(BigInt(message) + alpha * G[0] + alpha * G[1]);
        const c = BigInt("0x" + keccak256(m));

        const rSigner = modulo(alpha - c * privateKey, P); // alpha = (rSigner + c * privateKey) mod l
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
}