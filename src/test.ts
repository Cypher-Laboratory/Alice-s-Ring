import { altSchnorrSignature } from "./shnorrSignature/alt_Schnorr";
import { keccak256 } from "js-sha3"; // fonction de hashage reconnue ?
import {
    G,
    randomBigint
} from "./utils";

const privateKey = randomBigint(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n);
const publicKey: [bigint, bigint] = [privateKey * G[0], privateKey * G[1]];

const message = "Hello World !";

const alpha = randomBigint(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n);

const sig = altSchnorrSignature(message, privateKey, alpha);



