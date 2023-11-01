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
const ringSignature_1 = require("../src/ringSignature");
const utils_1 = require("../src/utils");
const ripple_keypairs_1 = require("ripple-keypairs");
const curves_1 = require("../src/utils/curves");
const ed = __importStar(require("../src/utils/noble-libraries/noble-ED25519"));
console.log("------------------ TESTING FOR XRPL CONFIG ------------------\n");
const config = { derivationConfig: curves_1.Config.DEFAULT };
const ringSize = 2;
const ed25519 = new utils_1.Curve(utils_1.CurveName.ED25519); // could also be SECP256K1
const seed = "sEdSWniReyeCh7JLWUHEfNTz53pxsjX";
const keypair = (0, ripple_keypairs_1.deriveKeypair)(seed);
const signerPrivKey_ed = ed.utils.getExtendedPublicKey(BigInt("0x" + keypair.privateKey.slice(2)).toString(16)).scalar;
const ring_ed = randomRing(ringSize, ed25519.GtoPoint(), ed25519.N);
console.log("ring size: ", ring_ed.length + 1 + "\n"); // + 1 for the signer
/* TEST SIGNATURE GENERATION AND VERIFICATION - ED25519 */
console.log("------ SIGNATURE USING ED25519 ------\n");
const signature_ed = ringSignature_1.RingSignature.sign(ring_ed, signerPrivKey_ed, "test-xrpl-demo", ed25519, config);
console.log(signature_ed);
const verifiedSig_ed = signature_ed.verify();
console.log("\nIs sig valid ? ", verifiedSig_ed);
if (!verifiedSig_ed) {
    console.log("Error: Ring signature verification failed on ED25519");
    process.exit(1);
}
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
