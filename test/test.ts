import {
  Curve,
  CurveName,
  RingSignature,
  verifySchnorrSignature,
} from "../src";
import * as data from "./data";


const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

const ringSignature = RingSignature.sign(
  [],
  data.signerPrivKey,
  data.message,
  secp256k1,
);

console.log(ringSignature.verify());