import { RingSignature } from "./ringSignature";
import { piSignature } from "./signature/piSignature";
import { Curve, ED25519, Point, randomBigint } from "./utils";
import { ExtendedPoint } from "./utils/noble-libraries/noble-ED25519";

const tmp = [
  "42",
  "0c",
  "6f",
  "0c",
  "99",
  "5f",
  "3f",
  "78",
  "15",
  "0b",
  "a7",
  "f5",
  "d7",
  "e3",
  "09",
  "85",
  "ae",
  "be",
  "14",
  "61",
  "15",
  "4d",
  "42",
  "bc",
  "d4",
  "0f",
  "92",
  "11",
  "af",
  "e2",
  "a5",
  "05",
];
const signerPrivKeyBytes = new Uint8Array(tmp.map((x) => parseInt(x, 16)));
const privKey = BigInt("0x" + Buffer.from(signerPrivKeyBytes).toString("hex"));
const priv = [
  926127015555093326973908533125539491652580295586299699713181342559458121060n,
  2438507748444926500156175360028991153775555588115231615964478554901831554097n,
  4926464100658056745662829013300371983107822721580264728347596278899076719892n,
];
const ring = [
  new Point(
    Curve.ED25519,
    new Point(Curve.ED25519, [1n, 2n]).mult(priv[0]).toAffine(),
  ),
  new Point(
    Curve.ED25519,
    new Point(Curve.ED25519, [1n, 2n]).mult(priv[1]).toAffine(),
  ),
  new Point(
    Curve.ED25519,
    new Point(Curve.ED25519, [1n, 2n]).mult(priv[2]).toAffine(),
  ),
];
const message = "message";
const signerPubKey = new Point(
  Curve.ED25519,
  new Point(Curve.ED25519, ED25519.G).mult(privKey).toAffine(),
);
const partial_signature = RingSignature.partialSign(
  ring,
  message,
  signerPubKey,
  Curve.ED25519,
);
const piSig = piSignature(
  partial_signature.alpha,
  partial_signature.c,
  privKey,
  Curve.ED25519,
);
const signature = RingSignature.combine(partial_signature, piSig);
console.log(signature.verify());

// const a = 2n;
// const G = new Point(Curve.ED25519, ED25519.G);
// console.log("2*G: ", G.mult(a).x);
// console.log("G+G: ", G.add(G).x);
// const double = ExtendedPoint.fromAffine({
//   x: G.x,
//   y: G.y,
// });
// console.log("double G: ", double.double().x);
