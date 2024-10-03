import { Uint384 } from "@cypher-laboratory/ring-sig-utils/dist/src/u384";
/**
 * Interface representing a G1Point as used in cairo
 */
export interface CairoG1Point {
    x: Uint384;
    y: Uint384;
}
