import { RingSignature } from "../src/ringSignature";
import { randomBigint } from "../src/utils";
import { Curve, CurveName, Point } from "../src";
import { deriveKeypair } from "ripple-keypairs";
import { Config } from "../src/curves";
import * as ed from "../src/utils/noble-libraries/noble-ED25519";

console.log("------------------ TESTING FOR XRPL CONFIG ------------------\n");

const config = { derivationConfig: Config.DEFAULT };

const ringSize = 3;

const ed25519 = new Curve(CurveName.ED25519); // could also be SECP256K1

const seed = "sEdSWniReyeCh7JLWUHEfNTz53pxsjX";
const keypair = deriveKeypair(seed);

const signerPrivKey_ed = ed.utils.getExtendedPublicKey(
  BigInt("0x" + keypair.privateKey.slice(2)).toString(16),
).scalar;

const ring_ed = randomRing(ringSize, ed25519.GtoPoint(), ed25519.N);

console.log("ring size: ", ring_ed.length + 1 + "\n"); // + 1 for the signer

/* TEST SIGNATURE GENERATION AND VERIFICATION - ED25519 */
console.log("------ SIGNATURE USING ED25519 ------\n");
const signature_ed = RingSignature.sign(
  ring_ed,
  signerPrivKey_ed,
  "test-xrpl-demo",
  ed25519,
  config,
);

console.log(signature_ed);

const verifiedSig_ed = signature_ed.verify();

console.log("\nIs sig valid ? ", verifiedSig_ed);

if (!verifiedSig_ed) {
  console.log("Error: Ring signature verification failed on ED25519");
  process.exit(1);
}

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

const secp256k1 = new Curve(CurveName.SECP256K1);
console.log(
  randomRing(3, secp256k1.GtoPoint(), secp256k1.N).map((p) => [p.x, p.y]),
);
