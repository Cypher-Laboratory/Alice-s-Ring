import { ProjectivePoint } from "./noble-SECP256k1";

/**
 * Multiplies a scalar by a point on the elliptic curve.
 * 
 * @param scalar - the scalar to multiply
 * @param point - the point to multiply
 * @returns the result of the multiplication
 */
export function mult(scalar: bigint, point: [bigint, bigint]): [bigint, bigint] {
  const result = ProjectivePoint.fromAffine(
    {
      x: point[0],
      y: point[1],
    }
  )
    .mul(scalar);

  return [result.x, result.y];
}

export function add(point1: [bigint, bigint], point2: [bigint, bigint]): [bigint, bigint] {
  const result = ProjectivePoint.fromAffine(
    {
      x: point1[0],
      y: point1[1],
    }
  )
    .add(ProjectivePoint.fromAffine(
      {
        x: point2[0],
        y: point2[1],
      }
    ));

  return [result.x, result.y];
}

import { G, P } from "./curveConst";
import { piSignature } from "../signature/piSignature";
import { randomBigint } from "./randomNumbers";
import { modulo } from "./modulo";

const alpha = modulo(79039774627681496637371022487067148235909477504934038113102041437647080880729n, P) as bigint;
const c = modulo(112711660439710606056748659173929673102114977341539408544630613555209775888121n, P) as bigint;
const signerPrivKey = modulo(25583027980570883691656905877401976406448868254816295069919888960541586679410n, P) as bigint;
const K = mult(signerPrivKey, G);
console.log("is K on curve ?: ", K[1] ** 2n % P === (K[0] ** 3n + 7n) % P);
const r = piSignature(alpha, c, signerPrivKey, P);
// signerPrivKey = kpi
// rpi * G + cpi * Kpi = rpi * G + cpi * kpi * G = (rpi + cpi * kpi) * G = alpha * G
// r = alpha - c * signerPrivKey

const alphaG = mult(alpha, G); // alpha * G
const a = mult(r, G) as [bigint, bigint];
const b = mult(c, K) as [bigint, bigint];
const beta = add(a, b); // rpi * G + cpi * Kpi      // DOES NOT WORK HERE
const beta2 = add(mult(r, G), (mult(modulo(c*signerPrivKey, P) as bigint, G))); // rpi * G + cpi * kpi * G
const beta2p = add(mult(r, G), mult(c, (mult(signerPrivKey, G)))); // rpi * G + cpi * kpi * G

const beta3 = mult(modulo(r+c*signerPrivKey, P) as bigint, G); // (rpi + cpi * kpi) * G

console.log("alphaG: ", alphaG);
console.log("beta: ", beta);
console.log("beta2: ", beta2);
console.log("beta2p: ", beta2p);
console.log("beta3: ", beta3);
console.log('\n');

// i need alphaG === beta
console.log("alphaG === beta: ", alphaG === beta);
// i need mult(c, K) === mult(modulo(c*signerPrivKey, P) as bigint, G))
console.log("c * K: ", mult(c, K));
console.log("(c * k) * G: ", mult(modulo(c*signerPrivKey, P) as bigint, G));
console.log("c * (k * G): ", mult(c, (mult(signerPrivKey, G))));





// console.log("alphaG === beta: ", alphaG === beta);
