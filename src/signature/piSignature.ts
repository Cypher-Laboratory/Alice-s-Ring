/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/) 
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but 
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/

import { modulo } from "../utils";
import { G } from "../utils/curveConst";
import { ProjectivePoint } from "../utils/noble-SECP256k1";

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

/**
 * Compute the signature from the actual signer
 *
 * @param alpha - the alpha value
 * @param c - the c[pi] value
 * @param signerPrivKey - the private key of the signer
 * @param p - the order of the curve
 *
 * @returns the signature
 */
export function piSignature(
  alpha: bigint,
  c: bigint,
  signerPrivKey: bigint,
  p: bigint,
): bigint {
  return modulo(alpha - c * signerPrivKey, p) as bigint;
}
