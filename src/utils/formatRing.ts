import { SignatureConfig } from "../ringSignature";
import { Point } from "./point";

/**
 * Formats a ring according to the config.
 *
 * @param ring - the ring to format
 * @param config - the config to use
 * @returns the formatted ring
 */
export function formatRing(
  ring: Point[],
  config: SignatureConfig | undefined,
): Point[] | string {
  if (config?.evmCompatibility) {
    return ring
      .map((point: Point) => point.x.toString() + point.y.toString())
      .join("");
  }
  return ring;
}
