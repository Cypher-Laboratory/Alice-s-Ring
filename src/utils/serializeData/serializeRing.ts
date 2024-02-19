import { Point } from "../../point";

/**
 * Formats a ring according to the config.
 *
 * @param ring - the ring to format
 * @returns the formatted ring
 */
export function serializeRing(ring: Point[]): string {
  return ring.map((point: Point) => point.serializePoint()).join("");
}
