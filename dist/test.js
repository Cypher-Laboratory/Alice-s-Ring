"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ripple_keypairs_1 = require("ripple-keypairs");
const src_1 = require("./src");
const curves_1 = require("./src/utils/curves");
const ringSize = 3;
function randomRing(ringLength = 1000, G, N) {
    let k = (0, src_1.randomBigint)(N * N);
    if (ringLength == 0)
        return [];
    const ring = [G.mult(k)];
    for (let i = 1; i < ringLength - 1; i++) {
        // once we add the signer, we get the wanted ring size
        k = (0, src_1.randomBigint)(N * N);
        ring.push(G.mult(k));
    }
    return ring;
}
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
const G_ED = new src_1.Point(ed25519, ed25519.G);
const ring_ed = randomRing(ringSize, G_ED, ed25519.N);
const signerPubKey_ed = src_1.Point.fromHexXRPL("ED06E7491D7E57F09D7E31E2FDD7F0DCE7FE7C00AEDA581B47D311D3E0E2BE68BD");
const seedED25519 = "sEdSWniReyeCh7JLWUHEfNTz53pxsjX";
const keypairED25519 = (0, ripple_keypairs_1.deriveKeypair)(seedED25519);
const signerPrivKey_ed = BigInt("0x" + keypairED25519.privateKey.slice(2));
const partialSig_ed = src_1.RingSignature.partialSign(ring_ed, "test", signerPubKey_ed, ed25519, { derivationConfig: curves_1.Config.XRPL });
// end signing
const signerResponse_ed = (0, src_1.piSignature)(partialSig_ed.alpha, partialSig_ed.cpi, signerPrivKey_ed, ed25519);
const sig_ed = src_1.RingSignature.combine(partialSig_ed, signerResponse_ed);
const verifiedPartialSig_ed = sig_ed.verify();
console.log("Is partial sig valid ? ", verifiedPartialSig_ed);
console.log("signature: ", sig_ed);
if (!verifiedPartialSig_ed) {
    console.log("Error: Partial signature verification failed on ED25519");
    process.exit(1);
}
