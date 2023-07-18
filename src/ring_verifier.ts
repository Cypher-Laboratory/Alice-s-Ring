import { keccak256 } from "js-sha3";
import { G, randomBigint, getRandomSecuredNumber, modulo, P } from "./utils";

export function sigVerif(message: string, cValue: string,responses: bigint[],ring: [bigint, bigint][]) : boolean {
    let newCValues :string[]= []; 

    console.log(ring.length)
    for(let j = 0; j < ring.length;j++){
         newCValues[j+1] = keccak256(ring+message+responses[j]*G[0]+responses[j]*G[1]+BigInt("0x"+cValue[j])*ring[j][0]+BigInt("0x"+cValue[j])*ring[j][1]); 
         if(j == ring.length-1){
             newCValues[0] = keccak256(ring+message+responses[j]*G[0]+responses[j]*G[1]+BigInt("0x"+cValue[j])*ring[j][0]+BigInt("0x"+cValue[j])*ring[j][1]); 
         }
         console.log(newCValues[j+1])
         }
    
    console.log(cValue)

    if(newCValues[0] == cValue){
    return true;
    }else{
        return false;
    }
}