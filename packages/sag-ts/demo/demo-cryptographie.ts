import { Curve, CurveName } from "@cypher-laboratory/ring-sig-utils";
import { RingSignature } from "../src/ringSignature";
import * as data from "../test/data";

const curve = new Curve(CurveName.SECP256K1);

const message = "Hello world !";

const signerPrivKey =
  47051336597389160587656532098427095267996634998425092693862103756529453934308865022401716n;

const ring = data.publicKeys_secp256k1.slice(0, 3);

const signature = RingSignature.sign(ring, signerPrivKey, message, curve);

const verified = signature.verify();

console.log("\n\tverified: ", verified, "\n");
