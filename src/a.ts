import { keccak256 } from "js-sha3";
import { G, P, modulo, randomBigint } from "./utils";

export function sign(witnesses : [[bigint, bigint]], signerPk : bigint, message : string){

    // generate random number alpha
    const alpha = randomBigint(P);

    // randomly set the index of the signer using randomly secured function
    const pi = 6; 
    //random response for everybody execpt the signer
    const fakeResponses: bigint[] = [];
    for (let i = 0; i < witnesses.length; i++) {
            fakeResponses.push(randomBigint(P));
    }

    // contains all the c from pi+1 to n 
    let cValuesPI1N: string[] = [];
    // calcul of C pi+1
    cValuesPI1N.push(keccak256(witnesses + message + String(alpha * G[0]) + String(alpha * G[1])));
    

    for(let i = pi+2; i<witnesses.length; i++){
        console.log("i: ", i);
        cValuesPI1N.push(keccak256(witnesses + message + 
            String(fakeResponses[i]*G[0] +BigInt("0x"+cValuesPI1N[i-pi-2])*witnesses[i][0]+BigInt("0x"+cValuesPI1N[i-pi-2])*witnesses[i][1]  + fakeResponses[i]*G[1])));
    }
    //contains all the c from 0 to pi-1
    let cValues0PI1:string[] = []; 

    cValues0PI1.push(keccak256(witnesses + message +
        String(fakeResponses[witnesses.length-1]*G[0] +BigInt("0x"+cValuesPI1N[cValuesPI1N.length-1])*witnesses[witnesses.length-1][0]+BigInt("0x"+cValuesPI1N[cValuesPI1N.length-1])*witnesses[witnesses.length-1][1]  + fakeResponses[witnesses.length-1]*G[1]))
        ); 

    for(let i =1; i<pi+1; i++){
        console.log("j: ", i);
        cValues0PI1[i] = keccak256(witnesses + message + 
            String(fakeResponses[i]*G[0] +BigInt("0x"+cValues0PI1[i-1])*witnesses[i][0]+BigInt("0x"+cValues0PI1[i-1])*witnesses[i][1]  + fakeResponses[i]*G[1]));
    }

    //concatenate CVAlues0PI1 and CVAluesPI1N
    let cValues:string[] = cValues0PI1.concat(cValuesPI1N);
    console.log("cValues: ", cValues);

    //define the signer response
    const signerResponse = modulo(alpha - BigInt("0x"+cValues[pi]) * signerPk, P); //module L, quelle est la valeur de L ?
    console.log("fakeResponses: ", fakeResponses); 
    console.log("signerResponse: ", signerResponse);

    return {
        cees: cValues,
        responses : fakeResponses.slice(0,pi).concat([signerResponse]).concat(fakeResponses.slice(pi, fakeResponses.length))
    }
}


function verify(sig :any, witnesses : [[bigint, bigint]], message : string){
    let values : String[] = []; //contains all the c from 1 to n    
   
    for(let i=1; i<witnesses.length; i++){
        values.push(keccak256(witnesses+message+
            String(sig.responses[i-1]*G[0]+BigInt("0x"+sig.cees[i-1])*witnesses[i-1][0]+BigInt("0x"+sig.cees[i-1])*witnesses[i-1][1]+sig.responses[i-1]*G[1])));
    }
    
    const firstValue:String = keccak256(witnesses+message+String(sig.responses[sig.responses.length-1]*G[0]+BigInt("0x"+sig.cees[sig.cees.length-1])*witnesses[witnesses.length-1][0]+BigInt("0x"+sig.cees[sig.cees.length-1])*witnesses[witnesses.length-1][1]+sig.responses[sig.responses.length-1]*G[1]));
    console.log([firstValue].concat(values));

}

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


const r = sign(ring, 0n, "test")
console.log(r);
verify( r, ring, "test")



 