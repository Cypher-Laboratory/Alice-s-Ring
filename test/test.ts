import { Curve, CurveName, RingSignature, SignatureConfig } from "../src";
import * as data from "./data";

const secp256k1 = new Curve(CurveName.SECP256K1);

const config = {
  // hash: HashFunction.SHA512,
  // evmCompatibility: true,
} satisfies SignatureConfig;

// const witness = RingSignature.sign(
//   data.publicKeys_secp256k1.slice(3, 5),
//   data.signerPrivKey,
//   data.message,
//   secp256k1,
//   config,
// );

// console.log("witness: ", witness.verify());

const signature = RingSignature.sign(
  data.publicKeys_secp256k1.slice(0, 2),// 3, 6
  data.signerPrivKey,
  data.message,
  secp256k1,
  config,
);

console.log(signature.verify());

// // console.log(signature.toJsonString());

// const b64 = signature.toBase64();

// console.log(RingSignature.verify(b64));


// console.log("message\n", signature.messageDigest);
// console.log("ring\n", signature.getRing().map((p) => [p.x, p.y]).flat());
// console.log("r\n", signature.getResponses());
// console.log("c\n", signature.getChallenge());

// console.log("\n");
// const G = secp256k1.GtoPoint();
// const alpha = 93912359358129671531178796343875823858211554642024309756116746298411062756974n;
// const alphaG = G.mult(alpha);

// const c = 19585932915025998020433259902072340669390029872993675899087827356791044109318n;
// const r = 25477375032281159073555946492478238959315179779986193090141042957128390858320n;
// const K = data.signerPubKey_secp256k1;
// const point = G.mult(r).add(K.mult(c));



console.log("ring\n", signature.getRing().map((p) => p.serialize()));
console.log("responses: ", signature.getResponses());
// console.log("alphaG\n", alphaG.serialize());
// console.log("point\n", point.serialize());



