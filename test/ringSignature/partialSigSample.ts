import { PartialSignature, Curve, CurveName } from "../../src";
import * as data from "../data";

const c = 112890922974095286386524977129045188852856887520479882666505737254358450777990n;
const cpi = 112890922974095286386524977129045188852856887520479882666505737254358450777990n;
const alpha = 112890922974095286386524977129045188852856887520479882666505737254358450777990n;
const secp256k1 = new Curve(CurveName.SECP256K1);

export const valid: PartialSignature = {
  message: data.message,
  ring: data.publicKeys_secp256k1,
  pi: 2,
  c: c,
  cpi: cpi,
  alpha: alpha,
  responses: data.randomResponses,
  curve: secp256k1,
  config: {}
}

export const invalid: PartialSignature = {
  message: data.message,
  ring: data.publicKeys_secp256k1,
  pi: 2,
  c: c,
  cpi: cpi,
  alpha: alpha,
  responses: data.randomResponses,
  curve: secp256k1,
  config: {}
}