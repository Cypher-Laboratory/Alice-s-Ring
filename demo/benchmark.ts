import { Curve, CurveName, Point, RingSignature, randomBigint } from "../src";
import fs from "fs";

const curve = new Curve(CurveName.SECP256K1);
const message = "Hello world !";
const signerPrivKey =
  47051336597389160587656532098427095267996634998425092693862103756529453934308865022401716n;
const config = {};

let ring: Point[] = [];

// create if not exists ./demo/benchmark.json
if (!fs.existsSync("./demo/benchmark.json")) {
  fs.writeFileSync("./demo/benchmark.json", JSON.stringify({}));
} else {
  fs.writeFileSync("./demo/benchmark.json", JSON.stringify({})); // reset it
}

const timings: {
  ringSize: number;
  generation: number;
  verification: number;
}[] = [];

for (let i = 1; i < 2001; i += 100) {
  // update ring
  ring = ring.concat(randomRing(i - ring.length));
  // sign
  const init_sign = Date.now();
  const signature = RingSignature.sign(
    ring,
    signerPrivKey,
    message,
    curve,
    config,
  );
  const end_sign = Date.now();

  // verify
  signature.verify();
  const end_verify = Date.now();

  // push timings
  timings.push({
    ringSize: i,
    generation: end_sign - init_sign,
    verification: end_verify - end_sign,
  });

  console.log(
    "ring size: ",
    i,
    "\tgeneration timing: ",
    end_sign - init_sign,
    "\tverification timing: ",
    end_verify - end_sign,
  );
}

// save timings
const benchmark = JSON.parse(
  fs.readFileSync("./demo/benchmark.json").toString(),
);
timings.forEach((timing) => {
  benchmark[timing.ringSize] = {
    generation: timing.generation,
    verification: timing.verification,
  };
});

fs.writeFileSync("./demo/benchmark.json", JSON.stringify(benchmark));

function randomRing(size: number): Point[] {
  const ring = [];
  for (let i = 0; i < size; i++) {
    ring.push(curve.GtoPoint().mult(randomBigint(curve.P)));
  }
  return ring;
}
