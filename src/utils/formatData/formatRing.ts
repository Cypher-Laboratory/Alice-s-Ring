import { Point } from "../../point";

/**
 * Formats a ring according to the config.
 *
 * @param ring - the ring to format
 * @param config - the config to use
 * @returns the formatted ring
 */
export function formatRing(ring: Point[]): string {
  return ring
    .map((point: Point) => point.x.toString() + point.y.toString())
    .join("");
}
