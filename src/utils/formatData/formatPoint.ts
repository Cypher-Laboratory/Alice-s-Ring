import { Point } from "../../point";

/**
 * Format a point according to the selected config
 *
 * @remarks
 * Default value is Point.toString()
 *
 * @param point - the point to format
 * @param config - the config to use
 *
 * @returns the formatted point
 */
export function formatPoint(point: Point): string {
  return point.x.toString() + point.y.toString();
}
