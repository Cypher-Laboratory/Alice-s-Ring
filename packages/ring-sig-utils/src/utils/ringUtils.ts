import { Curve } from "../curves";
import { Point } from "../point";
import * as err from "../errors";
import { checkPoint } from "./pointsUtils";

/**
 * Check if the points are sorted in ascending order and if the specified point in in the array
 *
 * @param points - Array of points
 * @returns True if the points are sorted in ascending order, false otherwise
 *
 * @throws {Error} If 2 points have the same x and y coordinates
 */
export function isRingSorted(points: Point[]): boolean {
  for (let i = 0; i < points.length - 1; i++) {
    // Check if current point's x is greater than next point's x (not in ascending order)
    if (points[i].x > points[i + 1].x) {
      return false;
    }
    // Check if current point's x is equal to next point's x
    if (points[i].x === points[i + 1].x) {
      // If x's are equal, check if current point's y is greater than next point's y (not in ascending order)
      if (points[i].y > points[i + 1].y) {
        return false;
      }
    }
    if (points[i].x === points[i + 1].x && points[i].y === points[i + 1].y) {
      throw new Error("Duplicates points found in the ring.");
    }
  }
  // If all checks pass, the array is sorted correctly
  return true;
}

/**
 * Check if a ring is valid
 *
 * @param ring - The ring to check
 * @param ref - The curve to use as a reference (optional, if not set, the first point's curve will be used)
 * @param emptyRing - If true, the ring can be empty
 *
 * @throws Error if the ring is empty
 * @throws Error if the ring contains duplicates
 * @throws Error if at least one of the points is invalid
 */
export function checkRing(ring: Point[], ref?: Curve, emptyRing = false): void {
  // check if the ring is empty
  if (ring.length === 0 && !emptyRing) throw err.noEmptyRing;
  if (!ref) ref = ring[0].curve;

  // check for duplicates using a set
  if (new Set(serializeRing(ring)).size !== ring.length)
    throw err.noDuplicates("ring");

  // check if all the points are valid
  try {
    for (const point of ring) {
      checkPoint(point, ref);
    }
  } catch (e) {
    throw err.invalidPoint(("At least one point is not valid: " + e) as string);
  }
}

/**
 * Sort a ring by x ascending coordinate (and y ascending if x's are equal)
 *
 * @param ring the ring to sort
 * @returns the sorted ring
 */
export function sortRing(ring: Point[]): Point[] {
  return ring.sort((a, b) => {
    if (a.x !== b.x) {
      return a.x < b.x ? -1 : 1;
    }
    return a.y < b.y ? -1 : 1;
  });
}

/**
 * Serialize a ring, i.e., serialize each point in the ring
 *
 * @param ring - The ring to serialize
 *
 * @returns The serialized ring as a string array
 */
export function serializeRing(ring: Point[]): string[] {
  const serializedPoints: string[] = [];
  for (const point of ring) {
    serializedPoints.push(point.serialize()); // Call serialize() on each 'point' object
  }
  return serializedPoints;
}
