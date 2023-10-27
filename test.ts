import { deriveKeypair } from "ripple-keypairs";
import {
  Curve,
  CurveName,
  Point,
  RingSignature,
  piSignature,
  randomBigint,
} from "./src";
import { Config } from "./src/utils/curves";
const ringSize = 3;

function randomRing(ringLength = 1000, G: Point, N: bigint): Point[] {
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
const ed25519 = new Curve(CurveName.ED25519);

const G_ED = new Point(ed25519, ed25519.G);

const ring_ed = randomRing(ringSize, G_ED, ed25519.N);
const signerPubKey_ed = Point.fromHexXRPL(
  "ED06E7491D7E57F09D7E31E2FDD7F0DCE7FE7C00AEDA581B47D311D3E0E2BE68BD",
);
const seedED25519 = "sEdSWniReyeCh7JLWUHEfNTz53pxsjX";
const keypairED25519 = deriveKeypair(seedED25519);
const signerPrivKey_ed = BigInt("0x" + keypairED25519.privateKey.slice(2));

const partialSig_ed = RingSignature.partialSign(
  ring_ed,
  "test",
  signerPubKey_ed,
  ed25519,
  { derivationConfig: Config.XRPL },
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

console.log("signature: ", sig_ed);
if (!verifiedPartialSig_ed) {
  console.log("Error: Partial signature verification failed on ED25519");
  process.exit(1);
}
