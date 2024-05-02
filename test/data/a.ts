import { RingSignature } from "../../src";
import {publicKeys_secp256k1} from "./points";
import { SECP256K1 } from "./curves";
const ringSignature = RingSignature.sign(publicKeys_secp256k1,7069703747800168800841771186958206142862606681731919084257487194227631820455n,"hello world",SECP256K1); 
console.log(ringSignature.toBase64());