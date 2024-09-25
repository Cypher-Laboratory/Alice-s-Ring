import { Point } from "../point";
import { modPow } from "./modPow";
import { modulo } from "./modulo";
import { CurveName } from "../curves";

const ED25519_CONSTANTS = {
  A: 57896044618658097711785492504343953926634992332820282019728792003956564819948n,
  D: 37095705934669439343138083508754565189542113879843219016388785533085940283555n,
  P: 57896044618658097711785492504343953926634992332820282019728792003956564819949n,
};

/* 
 * rewrite of the toWeierstrass function from garaga
    def to_weierstrass(self, x_twisted, y_twisted):
        a = self.a_twisted
        d = self.d_twisted
        return (
            (5 * a + a * y_twisted - 5 * d * y_twisted - d)
            * pow(12 - 12 * y_twisted, -1, self.p)
            % self.p,
            (a + a * y_twisted - d * y_twisted - d)
            * pow(4 * x_twisted - 4 * x_twisted * y_twisted, -1, self.p)
            % self.p,
        )
*/
/**
 * Converts a point from Twisted Edwards to Weierstrass coordinates
 * @param a_twisted The 'a' parameter of the Twisted Edwards curve
 * @param d_twisted The 'd' parameter of the Twisted Edwards curve
 * @param p The prime modulus
 * @param x_twisted The x-coordinate in Twisted Edwards form
 * @param y_twisted The y-coordinate in Twisted Edwards form
 * @returns A tuple [x, y] representing the point in Weierstrass coordinates
 */
export function toWeierstrass(
  a_twisted: bigint,
  d_twisted: bigint,
  p: bigint,
  x_twisted: bigint,
  y_twisted: bigint,
): [bigint, bigint] {
  const a = a_twisted;
  const d = d_twisted;

  const x = modulo(
    (5n * a + a * y_twisted - 5n * d * y_twisted - d) *
      modPow(12n - 12n * y_twisted, -1n, p),
    p,
  );
  const y = modulo(
    (a + a * y_twisted - d * y_twisted - d) *
      modPow(4n * x_twisted - 4n * x_twisted * y_twisted, -1n, p),
    p,
  );
  return [x, y];
}

/*
 *Rewrite of the to_twistededwards function from garaga
  def to_twistededwards(self, x_weirstrass: int, y_weirstrass: int):
        a = self.a_twisted
        d = self.d_twisted
        y = (
            (5 * a - 12 * x_weirstrass - d)
            * pow(-12 * x_weirstrass - a + 5 * d, -1, self.p)
            % self.p
        )
        x = (
            (a + a * y - d * y - d)
            * pow(4 * y_weirstrass - 4 * y_weirstrass * y, -1, self.p)
            % self.p
        )
        return (x, y)
 */
/**
 * Converts a point from Weierstrass to Twisted Edwards coordinates
 * @param a_twisted The 'a' parameter of the Twisted Edwards curve
 * @param d_twisted The 'd' parameter of the Twisted Edwards curve
 * @param p The prime modulus
 * @param x_twisted The x-coordinate in Weirstrass form
 * @param y_twisted The y-coordinate in Weirstrass form
 * @returns A tuple [x, y] representing the point in Weierstrass coordinates
 */
export function toTwistedEdwards(
  a_twisted: bigint,
  d_twisted: bigint,
  p: bigint,
  x_weierstrass: bigint,
  y_weierstrass: bigint,
): [bigint, bigint] {
  const a = a_twisted;
  const d = d_twisted;
  const y = modulo(
    (5n * a - 12n * x_weierstrass - d) *
      modPow(-12n * x_weierstrass - a + 5n * d, -1n, p),
    p,
  );
  const x = modulo(
    (a + a * y - d * y - d) *
      modPow(4n * y_weierstrass - 4n * y_weierstrass * y, -1n, p),
    p,
  );
  return [x, y];
}

/**
 * Converts a point from Twisted Edwards to Weierstrass coordinates.
 *
 * This function serves as a wrapper around the `toWeierstrass` function,
 * specifically designed to work with the Point class. It currently supports
 * only the ED25519 curve.
 *
 * @param p The Point object to convert, must be on a supported curve.
 * @returns A tuple [x, y] representing the point in Weierstrass coordinates.
 * @throws Will throw an Error if the curve is not supported.
 */
export function pointToWeirstrass(p: Point) {
  switch (p.curve.name) {
    case CurveName.ED25519: {
      return toWeierstrass(
        ED25519_CONSTANTS.A,
        ED25519_CONSTANTS.D,
        ED25519_CONSTANTS.P,
        p.x,
        p.y,
      );
    }
    default:
      throw new Error(`Curve ${p.curve.name} not supported`);
  }
}

/**
 * Computes and returns the MSM (Multi-Scalar Multiplication) hint for a given set of points and scalars.
 * This function uses the Garaga library to generate a hint for efficient MSM computation.
 *
 * @param points An array of points in Weierstrass coordinates, each represented as a tuple [x, y] of bigints.
 * @param scalars An array of bigint scalars corresponding to the points.
 * @returns A Promise that resolves to a bigint array containing the MSM hint.
 * @throws Will throw an error if the Garaga library fails to initialize or if the MSM calldata building fails.
 */
export async function prepare_garaga_hint(
  points: [bigint, bigint][],
  scalars: bigint[],
): Promise<bigint[]> {
  try {
    const garaga = await import("garaga");
    await garaga.init();
    return garaga.msmCalldataBuilder(points, scalars, garaga.CurveId.X25519, {
      includeDigitsDecomposition: false,
    });
  } catch (error) {
    console.error(
      "Failed to initialize the WASM module or perform operation:",
      error,
    );
    throw new Error(`Garaga operation failed: ${error}`);
  }
}
