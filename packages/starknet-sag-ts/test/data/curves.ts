import { Curve, CurveName } from "@cypher-laboratory/ring-sig-utils";

export const SECP256K1 = new Curve(CurveName.SECP256K1);
export const ED25519 = new Curve(CurveName.ED25519);
