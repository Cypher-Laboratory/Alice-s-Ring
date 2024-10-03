import { Curve, CurveName } from "@cypher-laboratory/ring-sig-utils";
import { RingSignature } from "../src/ringSignature";
import * as data from "../test/data";

/**
 * Example of how to use the lib to generate call data for a ring signature using secp256k1
 */
async function callDataSECP256K1() {
  const curve = new Curve(CurveName.SECP256K1);

  const message = "Hello world !";

  const signerPrivKey =
    4705133659738916058765656634998425092693862103756529453934308865022401716n;

  const ring = data.publicKeys_secp256k1.slice(0, 3);

  const signature = RingSignature.sign(ring, signerPrivKey, message, curve);
  const rawCallData = await signature.getCallData();
  console.log("SECP256K1 callData value : ", rawCallData.toString());
}

/**
 * Example of how to use the lib to generate call data for a ring using ED25519
 */
async function callDataED25519() {
  const curve = new Curve(CurveName.ED25519);

  const message = "Hello world !";

  const signerPrivKey =
    4705133659738916058765656634998425092693862103756529453934308865022401716n;

  const ring = data.publicKeys_ed25519.slice(0, 3);

  const signature = RingSignature.sign(ring, signerPrivKey, message, curve);
  const rawCallData = await signature.getCallData();
  console.log("ED25519 callData value :", rawCallData.toString());
}

callDataSECP256K1();
callDataED25519();
