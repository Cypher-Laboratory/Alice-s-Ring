import { SignatureConfig } from "../ringSignature";
import { Point } from "./point";
/**
 * Formats a ring according to the config.
 *
 * @param ring - the ring to format
 * @param config - the config to use
 * @returns the formatted ring
 */
export declare function formatRing(ring: Point[], config: SignatureConfig | undefined): Point[] | string;
