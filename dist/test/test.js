"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const ringSignature_1 = require("../src/ringSignature");
const utils_1 = require("../src/utils");
const ripple_keypairs_1 = require("ripple-keypairs");
const curves_1 = require("../src/utils/curves");
const ed = __importStar(require("../src/utils/noble-libraries/noble-ED25519"));
const CONFIG = curves_1.Config.DEFAULT;
console.log("------ TESTING FOR XRPL CONFIG ------");
const config = { derivationConfig: CONFIG };
const ringSize = 10;
const secp256k1 = new utils_1.Curve(utils_1.CurveName.SECP256K1);
const ed25519 = new utils_1.Curve(utils_1.CurveName.ED25519);
const G_SECP = secp256k1.GtoPoint();
const signerPrivKey_secp = 4663621002712304654134267866148565564648521986326001983848741804705428459856n;
const signerPubKey_secp = G_SECP.mult(signerPrivKey_secp);
const ring_secp = randomRing(ringSize, G_SECP, secp256k1.N);
const seed = "sEdSWniReyeCh7JLWUHEfNTz53pxsjX";
const keypair = (0, ripple_keypairs_1.deriveKeypair)(seed);
const signerPrivKey_ed = ed.utils.getExtendedPublicKey(BigInt("0x" + keypair.privateKey.slice(2)).toString(16)).scalar;
const G_ED = new utils_1.Point(ed25519, ed25519.G);
const signerPubKey_ed = G_ED.mult(signerPrivKey_ed);
const ring_ed = randomRing(ringSize, G_ED, ed25519.N);
function randomRing(ringLength = 100, G, N) {
    let k = (0, utils_1.randomBigint)(N * N);
    if (ringLength == 0)
        return [];
    const ring = [G.mult(k)];
    for (let i = 1; i < ringLength - 1; i++) {
        // once we add the signer, we get the wanted ring size
        k = (0, utils_1.randomBigint)(N * N);
        ring.push(G.mult(k));
    }
    return ring;
}
console.log("ring size: ", ring_ed.length + 1);
// /* TEST SIGNATURE GENERATION AND VERIFICATION - SECP256K1 */
// console.log("------ SIGNATURE USING SECP256K1 ------");
// const signature_secp = RingSignature.sign(
//   ring_secp,
//   signerPrivKey_secp,
//   "test",
//   secp256k1,
//   config,
// );
// const verifiedSig_secp = signature_secp.verify();
// console.log("Is sig valid ? ", verifiedSig_secp);
// if (!verifiedSig_secp) {
//   console.log("Error: Ring signature verification failed on SECP256K1");
//   process.exit(1);
// }
console.log("------ SIGNATURE USING ED25519 ------");
const signature_ed = ringSignature_1.RingSignature.sign(ring_ed, signerPrivKey_ed, "test", ed25519, config);
console.log("ring_ed.length: ", ring_ed.length);
console.log("signature_ed ring: ", signature_ed.ring.length);
console.log("signature_ed responses: ", signature_ed.responses.length);
const verifiedSig_ed = signature_ed.verify();
console.log("Is sig valid ? ", verifiedSig_ed);
if (!verifiedSig_ed) {
    console.log("Error: Ring signature verification failed on ED25519");
    process.exit(1);
}
/*--------------------- test base64 encoding and decoding ---------------------*/
console.log("------ TEST BASE64 ENCODING/DECODING ------");
const signature = ringSignature_1.RingSignature.sign(ring_ed, signerPrivKey_ed, "test", ed25519, config);
const base64Sig = signature.toBase64();
const retrievedSig = ringSignature_1.RingSignature.fromBase64(base64Sig);
const verifiedRetrievedSig = retrievedSig.verify();
const areIdentical = retrievedSig.message === signature.message &&
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
    console.log("Error: Signature encoding/decoding to base64 failed: sig are not identical");
    process.exit(1);
}
/*--------------------- test partial signature ---------------------*/
console.log("------ PARTIAL SIGNATURE USING SECP256K1 ------");
const partialSig_secp = ringSignature_1.RingSignature.partialSign(ring_secp, "test", signerPubKey_secp, secp256k1, config);
// end signing
const signerResponse_secp = (0, src_1.piSignature)(partialSig_secp.alpha, partialSig_secp.cpi, signerPrivKey_secp, secp256k1);
const sig_secp = ringSignature_1.RingSignature.combine(partialSig_secp, signerResponse_secp);
// console.log(sig_secp);
const verifiedPartialSig_secp = sig_secp.verify();
console.log("Is partial sig valid ? ", verifiedPartialSig_secp);
if (!verifiedPartialSig_secp) {
    console.log("Error: Partial signature verification failed on SECP256K1");
    process.exit(1);
}
console.log("------ PARTIAL SIGNATURE USING ED25519 ------");
const partialSig_ed = ringSignature_1.RingSignature.partialSign(ring_ed, "test", signerPubKey_ed, ed25519, config);
// end signing
const signerResponse_ed = (0, src_1.piSignature)(partialSig_ed.alpha, partialSig_ed.cpi, signerPrivKey_ed, ed25519);
const sig_ed = ringSignature_1.RingSignature.combine(partialSig_ed, signerResponse_ed);
const verifiedPartialSig_ed = sig_ed.verify();
console.log("Is partial sig valid ? ", verifiedPartialSig_ed);
if (!verifiedPartialSig_ed) {
    console.log("Error: Partial signature verification failed on ED25519");
    process.exit(1);
}
/*--------------------- test signature with ringSize = 0 ---------------------*/
console.log("------ TEST RING_SIZE = 0 USING SECP256K1 ------");
const signature_secp_empty_ring = ringSignature_1.RingSignature.sign([], signerPrivKey_secp, "test", secp256k1, config);
const verifiedSig_secp_empty_ring = signature_secp_empty_ring.verify();
console.log("Is sig valid ? ", verifiedSig_secp_empty_ring);
if (!verifiedSig_secp_empty_ring) {
    console.log("Error: Ring signature verification failed with ringSize=0 on SECP256K1");
    process.exit(1);
}
console.log("------ TEST RING_SIZE = 0 USING ED25519 ------");
const signature_ed_empty_ring = ringSignature_1.RingSignature.sign([], signerPrivKey_ed, "test", ed25519, config);
const verifiedSig_ed_empty_ring = signature_ed_empty_ring.verify();
console.log("Is sig valid ? ", verifiedSig_ed_empty_ring);
if (!verifiedSig_ed_empty_ring) {
    console.log("Error: Ring signature verification with ringSize=0 failed on ED25519");
    process.exit(1);
}
/*--------------------- test partial signature with ringSize = 0 ---------------------*/
console.log("------ PARTIAL SIGNATURE WITH RING_SIZE=0 USING SECP256K1 ------");
try {
    ringSignature_1.RingSignature.partialSign([], "test", signerPubKey_secp, secp256k1, config);
    process.exit(1);
}
catch (e) {
    console.log("Partial Signature with ringSize = 0 on SECP256K1 failed as expected");
}
console.log("------ PARTIAL SIGNATURE WITH RING_SIZE=0 USING ED25519 ------");
try {
    ringSignature_1.RingSignature.partialSign([], "test", signerPubKey_ed, ed25519, config);
    process.exit(1);
}
catch (e) {
    console.log("Partial Signature with ringSize = 0 on ED25519 failed as expected");
}
function areResponsesEquals(responses1, responses2) {
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
function areRingsEquals(ring1, ring2) {
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
const json = signature_ed_empty_ring.toJsonString();
const retrievedSigFromJson = ringSignature_1.RingSignature.fromJsonString(json);
const verifiedRetrievedSigFromJson = retrievedSigFromJson.verify();
console.log("Is sig from JSON valid? ", verifiedRetrievedSigFromJson);
if (!verifiedRetrievedSigFromJson) {
    console.log("Error: Signature conversion to JSON failed");
    process.exit(1);
}
function arePartialSigsEquals(partial1, partial2) {
    return (partial1.alpha === partial2.alpha &&
        partial1.cpi === partial2.cpi &&
        partial1.curve.name === partial2.curve.name &&
        partial1.message === partial2.message &&
        areRingsEquals(partial1.ring, partial2.ring) &&
        areResponsesEquals(partial1.responses, partial2.responses) &&
        partial1.pi === partial2.pi &&
        partial1.c === partial2.c);
}
/*--------------------- test partial ring signature <--> Base64 conversion ---------------------*/
console.log("------ CONVERT PARTIAL RING SIGNATURE TO Base64 AND RETRIEVE IT ------");
const base64RingSig = ringSignature_1.RingSignature.partialSigToBase64(partialSig_ed);
const retrievedPartialSig = ringSignature_1.RingSignature.base64ToPartialSig(base64RingSig);
const areIdenticals = arePartialSigsEquals(retrievedPartialSig, partialSig_ed);
console.log("Are the two partial signatures identical? ", areIdenticals);
if (!areIdenticals) {
    console.log("Error: Partial signature conversion to base64 failed");
    process.exit(1);
}
