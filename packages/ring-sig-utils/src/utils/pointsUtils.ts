import { Curve } from "../curves";
import { Point } from "../point";
import * as err from "../errors";

/**
 * Check if a point is valid
 *
 * @param point - The point to check
 * @param curve - The curve to use as a reference
 *
 * @throws Error if the point is not on the reference curve
 * @throws Error if at least 1 coordinate is not valid (= 0 or >= curve order)
 */
export function checkPoint(point: Point, curve?: Curve): void {
  if (curve && !curve.equals(point.curve)) {
    throw err.curveMismatch();
  }
  // check if the point is on the reference curve
  if (!point.curve.isOnCurve(point)) {
    throw err.notOnCurve();
  }
}
