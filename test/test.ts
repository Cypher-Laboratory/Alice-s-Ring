import {
  Curve,
  CurveName,
  Point,
  RingSignature,
  verifySchnorrSignature,
} from "../src";
import { hashFunction } from "../src/utils/hashFunction";
import * as data from "./data";


const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

// const ringSignature = RingSignature.sign(
//   data.publicKeys_ed25519,
//   data.signerPrivKey,
//   data.message,
//   ed25519,
//   { hash: hashFunction.SHA512 },
// );

// console.log(ringSignature.toBase64());

// console.log(data.idPointX_secp256k1.isValid())

// RingSignature.fromJsonString(data.jsonRS.undefinedResponses);


const signature = RingSignature.sign(
  data.publicKeys_secp256k1,
  data.signerPrivKey,
  data.message,
  secp256k1,
).toJsonString();

// modify the signature message
const editedSig = JSON.parse(signature);
editedSig.message = "Wrong message";

console.log(RingSignature.fromJsonString(editedSig).verify());