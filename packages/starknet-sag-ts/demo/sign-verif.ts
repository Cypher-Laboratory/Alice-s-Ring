import { Curve, CurveName } from "@cypher-laboratory/ring-sig-utils";
import { RingSignature } from "../src/ringSignature";
import * as data from "../test/data";

const curve = new Curve(CurveName.ED25519);

const message = "Hello world !";

const signerPrivKey =
  4705133659738916058765656634998425092693862103756529453934308865022401716n;

const ring = data.publicKeys_ed25519.slice(0, 3);

const signature = RingSignature.sign(ring, signerPrivKey, message, curve);

const verified = signature.verify();
console.log(signature.toJsonString());
console.log("\n\tverified: ", verified, "\n");
