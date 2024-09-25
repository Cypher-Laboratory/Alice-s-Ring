import { CairoRingSignature } from "./cairoRingSign";
import * as data from "../test/data";
import { Curve } from "./curves";
import { CurveName } from "./curves";
//import { toWeierstrass, toTwistedEdwards } from "./utils/garaga_bindings";
//import { G1Point, msmCalldataBuilder, CurveId, init } from "garaga";
const ed25519 = new Curve(CurveName.ED25519);
async function main() {
  const ring_signature = await CairoRingSignature.sign(
    data.publicKeys_ed25519,
    data.signerPrivKey,
    "test",
    ed25519,
  );
  console.log(ring_signature.verify());
  console.log(ring_signature.toBase64());
}
main();
/*  for (const p of ring_signature.getRing()) {
    console.log(p.toU384Coordinates());
  }
}¨/
main();
/*const x_twisted =
  39543460263672751862715731148177899282638773519115997227341754029484841581726n;
const y_twisted =
  4367959853343614974527137288414659086393892804139868448214890263094925695580n;

let weirstrassPoint = toWeierstrass(
  57896044618658097711785492504343953926634992332820282019728792003956564819948n7896044618658097711785492504343953926634992332820282019728792003956564819948n,
  37095705934669439343138083508754565189542113879843219016388785533085940283555n,
  57896044618658097711785492504343953926634992332820282019728792003956564819949n,
  x_twisted,
  y_twisted,
);
console.log("weirstrass Point : ", weirstrassPoint);
let twistedPoint = toTwistedEdwards(
  57896044618658097711785492504343953926634992332820282019728792003956564819948n,
  37095705934669439343138083508754565189542113879843219016388785533085940283555n,
  57896044618658097711785492504343953926634992332820282019728792003956564819949n,
  weirstrassPoint[0],
  weirstrassPoint[1],
);
console.log("twisted Points : ", twistedPoint);


export async function prepare_garaga_hint(
  points: G1Point[],
  scalars: bigint[],
) {
  try {
    await init();
    const result = msmCalldataBuilder(points, scalars, CurveId.X25519);
    return result;
  } catch (error) {
    console.error("Failed to initialize the WASM module:", error);
    throw error;
  }
}

async function main() {
  const point_weirstrass = [
    18715765525062420873934866352412272870272340493448316910134681123423727995433n,
    37474695223555073327807894612928568707470473361577297618204392818669193449817n,
  ];
  const b = await prepare_garaga_hint(
    [
      [
        18715765525062420873934866352412272870272340493448316910134681123423727995433n,
        37474695223555073327807894612928568707470473361577297618204392818669193449817n,
      ],
    ],
    [6n],
  );
  console.log(b.toString());
}

main();*/
