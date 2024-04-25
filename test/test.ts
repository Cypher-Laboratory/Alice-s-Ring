import { Hash } from "crypto";
import { Curve, CurveName, RingSignature, SignatureConfig } from "../src";
import * as data from "./data";
import { HashFunction } from "../src/utils/hashFunction";

const secp256k1 = new Curve(CurveName.SECP256K1);

const config = {
  // hash: HashFunction.SHA512,
  evmCompatibility: true,
} satisfies SignatureConfig;

const signature = RingSignature.sign(
  data.publicKeys_secp256k1,
  data.signerPrivKey,
  data.message,
  secp256k1,
  config
);

console.log(signature.verify());

// const b64 = signature.toBase64();

// console.log(RingSignature.verify(b64));
