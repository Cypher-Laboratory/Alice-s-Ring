import { RingSignature } from "./ringSignature";
import { Curve, ED25519, Point, randomBigint } from "./utils";


const privKey = randomBigint(ED25519.N);

const ring = [
  new Point (Curve.ED25519, new Point(Curve.ED25519, ED25519.G).mult(randomBigint(ED25519.N)).toBigintArray()),
  new Point (Curve.ED25519, new Point(Curve.ED25519, ED25519.G).mult(randomBigint(ED25519.N)).toBigintArray()),
  new Point (Curve.ED25519, new Point(Curve.ED25519, ED25519.G).mult(randomBigint(ED25519.N)).toBigintArray()),
]

const signature = RingSignature.sign(
  ring,
  privKey,
  "message",
  Curve.ED25519
)

console.log(signature.verify())

const a = 2n;
const G = new Point(Curve.ED25519, ED25519.G);
console.log(G.mult(a).x);
console.log(G.add(G).x);
