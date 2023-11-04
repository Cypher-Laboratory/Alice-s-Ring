import { piSignature } from "../src";
import {
  PartialSignature,
  RingSignature,
  SignatureConfig,
} from "../src/ringSignature";
import { Curve, Point, randomBigint, CurveName } from "../src/utils";
import { deriveKeypair } from "ripple-keypairs";
import { Config } from "../src/utils/curves";
import * as ed from "../src/utils/noble-libraries/noble-ED25519";

const config: SignatureConfig = {
  derivationConfig: Config.DEFAULT,
  evmCompatibility: true,
};

const ringSize = 10;
const secp256k1 = new Curve(CurveName.SECP256K1);
const ed25519 = new Curve(CurveName.ED25519);

const G_SECP = secp256k1.GtoPoint();
const signerPrivKey_secp =
  4663621002712304654134267866148565564648521986326001983848741804705428459856n;
const signerPubKey_secp = G_SECP.mult(signerPrivKey_secp);
const ring_secp = randomRing(ringSize, G_SECP, secp256k1.N);
const seed = "sEdSWniReyeCh7JLWUHEfNTz53pxsjX";
const keypair = deriveKeypair(seed);
const signerPrivKey_ed = ed.utils.getExtendedPublicKey(
  BigInt("0x" + keypair.privateKey.slice(2)).toString(16),
).scalar;

const G_ED = new Point(ed25519, ed25519.G);
const signerPubKey_ed = G_ED.mult(signerPrivKey_ed);
const ring_ed = randomRing(ringSize, G_ED, ed25519.N);

function randomRing(ringLength = 100, G: Point, N: bigint): Point[] {
  let k = randomBigint(N * N);
  if (ringLength == 0) return [];
  const ring: Point[] = [G.mult(k)];

  for (let i = 1; i < ringLength - 1; i++) {
    // once we add the signer, we get the wanted ring size
    k = randomBigint(N * N);
    ring.push(G.mult(k));
  }
  return ring;
}

console.log("ring size: ", ring_ed.length + 1);

/* TEST SIGNATURE GENERATION AND VERIFICATION - SECP256K1 */
console.log("------ SIGNATURE USING SECP256K1 ------");
const signature_secp = RingSignature.sign(
  ring_secp,
  signerPrivKey_secp,
  "test",
  secp256k1,
  // config,
);
const verifiedSig_secp = signature_secp.verify();
console.log("Is sig valid ? ", verifiedSig_secp);

if (!verifiedSig_secp) {
  console.log("Error: Ring signature verification failed on SECP256K1");
  process.exit(1);
}

console.log("------ SIGNATURE USING ED25519 ------");
const signature_ed = RingSignature.sign(
  ring_ed,
  signerPrivKey_ed,
  "test",
  ed25519,
  config,
);

const verifiedSig_ed = signature_ed.verify();

console.log("Is sig valid ? ", verifiedSig_ed);

if (!verifiedSig_ed) {
  console.log("Error: Ring signature verification failed on ED25519");
  process.exit(1);
}

/*--------------------- test base64 encoding and decoding ---------------------*/
console.log("------ TEST BASE64 ENCODING/DECODING ------");
const signature = RingSignature.sign(
  ring_ed,
  signerPrivKey_ed,
  "test",
  ed25519,
  config,
);
const base64Sig = signature.toBase64();
const retrievedSig = RingSignature.fromBase64(base64Sig);
const verifiedRetrievedSig = retrievedSig.verify();

const areIdentical =
  retrievedSig.message === signature.message &&
  retrievedSig.c === signature.c &&
  areResponsesEquals(retrievedSig.responses, signature.responses) &&
  areRingsEquals(retrievedSig.ring, signature.ring) &&
  retrievedSig.curve.name === signature.curve.name;

console.log("Is sig valid? ", verifiedRetrievedSig);
console.log("Are the two signatures identical? ", areIdentical);

if (!verifiedRetrievedSig) {
  console.log("Error: Signature encoding/decoding to base64 failed");
  process.exit(1);
}
if (!areIdentical) {
  console.log(
    "Error: Signature encoding/decoding to base64 failed: sig are not identical",
  );
  process.exit(1);
}

/*--------------------- test partial signature ---------------------*/
console.log("------ PARTIAL SIGNATURE USING SECP256K1 ------");
const partialSig_secp = RingSignature.partialSign(
  ring_secp,
  "test",
  signerPubKey_secp,
  secp256k1,
  config,
);
// end signing
const signerResponse_secp = piSignature(
  partialSig_secp.alpha,
  partialSig_secp.cpi,
  signerPrivKey_secp,
  secp256k1,
);
const sig_secp = RingSignature.combine(partialSig_secp, signerResponse_secp);
// console.log(sig_secp);
const verifiedPartialSig_secp = sig_secp.verify();
console.log("Is partial sig valid ? ", verifiedPartialSig_secp);
if (!verifiedPartialSig_secp) {
  console.log("Error: Partial signature verification failed on SECP256K1");
  process.exit(1);
}

console.log("------ PARTIAL SIGNATURE USING ED25519 ------");
const partialSig_ed = RingSignature.partialSign(
  ring_ed,
  "test",
  signerPubKey_ed,
  ed25519,
  config,
);
// end signing
const signerResponse_ed = piSignature(
  partialSig_ed.alpha,
  partialSig_ed.cpi,
  signerPrivKey_ed,
  ed25519,
);
const sig_ed = RingSignature.combine(partialSig_ed, signerResponse_ed);
const verifiedPartialSig_ed = sig_ed.verify();
console.log("Is partial sig valid ? ", verifiedPartialSig_ed);
if (!verifiedPartialSig_ed) {
  console.log("Error: Partial signature verification failed on ED25519");
  process.exit(1);
}

/*--------------------- test signature with ringSize = 0 ---------------------*/
console.log("------ TEST RING_SIZE = 0 USING SECP256K1 ------");
const signature_secp_empty_ring = RingSignature.sign(
  [],
  signerPrivKey_secp,
  "test",
  secp256k1,
  config,
);
const verifiedSig_secp_empty_ring = signature_secp_empty_ring.verify();
console.log("Is sig valid ? ", verifiedSig_secp_empty_ring);

if (!verifiedSig_secp_empty_ring) {
  console.log(
    "Error: Ring signature verification failed with ringSize=0 on SECP256K1",
  );
  process.exit(1);
}

console.log("------ TEST RING_SIZE = 0 USING ED25519 ------");
const signature_ed_empty_ring = RingSignature.sign(
  [],
  signerPrivKey_ed,
  "test",
  ed25519,
  config,
);
const verifiedSig_ed_empty_ring = signature_ed_empty_ring.verify();
console.log("Is sig valid ? ", verifiedSig_ed_empty_ring);

if (!verifiedSig_ed_empty_ring) {
  console.log(
    "Error: Ring signature verification with ringSize=0 failed on ED25519",
  );
  process.exit(1);
}

/*--------------------- test partial signature with ringSize = 0 ---------------------*/
console.log("------ PARTIAL SIGNATURE WITH RING_SIZE=0 USING SECP256K1 ------");
try {
  RingSignature.partialSign([], "test", signerPubKey_secp, secp256k1, config);
  process.exit(1);
} catch (e) {
  console.log(
    "Partial Signature with ringSize = 0 on SECP256K1 failed as expected",
  );
}

console.log("------ PARTIAL SIGNATURE WITH RING_SIZE=0 USING ED25519 ------");
try {
  RingSignature.partialSign([], "test", signerPubKey_ed, ed25519, config);
  process.exit(1);
} catch (e) {
  console.log(
    "Partial Signature with ringSize = 0 on ED25519 failed as expected",
  );
}

function areResponsesEquals(
  responses1: bigint[],
  responses2: bigint[],
): boolean {
  if (responses1.length !== responses2.length) {
    return false;
  }
  for (let i = 0; i < responses1.length; i++) {
    if (responses1[i] !== responses2[i]) {
      return false;
    }
  }
  return true;
}
function areRingsEquals(ring1: Point[], ring2: Point[]): boolean {
  if (ring1.length !== ring2.length) {
    console.log("ring size are !=");
    return false;
  }
  for (let i = 0; i < ring1.length; i++) {
    if (ring1[i].x !== ring2[i].x || ring1[i].y !== ring2[i].y) {
      return false;
    }
  }
  return true;
}

/*--------------------- test ring signature <--> JSON conversion ---------------------*/
console.log("------ CONVERT RING SIGNATURE TO JSON AND RETRIEVE IT ------");
const json = signature_ed.toJsonString();
const retrievedSigFromJson = RingSignature.fromJsonString(json);
const verifiedRetrievedSigFromJson = retrievedSigFromJson.verify();

console.log("Is sig from JSON valid? ", verifiedRetrievedSigFromJson);
if (!verifiedRetrievedSigFromJson) {
  console.log("Error: Signature conversion to JSON failed");
  process.exit(1);
}

function arePartialSigsEquals(
  partial1: PartialSignature,
  partial2: PartialSignature,
): boolean {
  return (
    partial1.alpha === partial2.alpha &&
    partial1.cpi === partial2.cpi &&
    partial1.curve.name === partial2.curve.name &&
    partial1.message === partial2.message &&
    areRingsEquals(partial1.ring, partial2.ring) &&
    areResponsesEquals(partial1.responses, partial2.responses) &&
    partial1.pi === partial2.pi &&
    partial1.c === partial2.c &&
    areConfigEquals(partial1.config, partial2.config)
  );
}

function areConfigEquals(
  config1: SignatureConfig | undefined,
  config2: SignatureConfig | undefined,
): boolean {
  if (config1 === undefined && config2 === undefined) {
    return true;
  }
  if (config1 === undefined || config2 === undefined) {
    return false;
  }
  return (
    config1.evmCompatibility === config2.evmCompatibility &&
    config1.derivationConfig === config2.derivationConfig &&
    config1.safeMode === config2.safeMode
  );
}

/*--------------------- test partial ring signature <--> Base64 conversion ---------------------*/
console.log(
  "------ CONVERT PARTIAL RING SIGNATURE TO Base64 AND RETRIEVE IT ------",
);
const base64RingSig = RingSignature.partialSigToBase64(partialSig_ed);
const retrievedPartialSig = RingSignature.base64ToPartialSig(base64RingSig);
const areIdenticals = arePartialSigsEquals(retrievedPartialSig, partialSig_ed);
console.log("Are the two partial signatures identical? ", areIdenticals);
if (!areIdenticals) {
  console.log("Error: Partial signature conversion to base64 failed");
  process.exit(1);
}
