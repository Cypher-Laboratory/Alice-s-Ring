import {
  Curve,
  CurveName,
  RingSignature,
  verifySchnorrSignature,
} from "../src";
import { hashFunction } from "../src/utils/hashFunction";
import * as data from "./data";


const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

const ringSignature = RingSignature.sign(
  data.publicKeys_ed25519,
  data.signerPrivKey,
  data.message,
  ed25519,
  { hash: hashFunction.SHA512 },
);

console.log(ringSignature.verify());