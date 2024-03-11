import { Point } from "../point";

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