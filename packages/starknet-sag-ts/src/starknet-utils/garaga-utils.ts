import {
  Point,
  modPow,
  mod,
  CurveName,
} from "@cypher-laboratory/ring-sig-utils";

const ED25519_CONSTANTS = {
  A: 57896044618658097711785492504343953926634992332820282019728792003956564819948n,
  D: 37095705934669439343138083508754565189542113879843219016388785533085940283555n,
  P: 57896044618658097711785492504343953926634992332820282019728792003956564819949n,
};

/**
 * Init the garaga wsm package.
 */
async function initGaraga() {
  try {
    const garaga = await import("garaga");
    await garaga.init();
    return garaga;
  } catch (error) {
    console.error("Failed to initialize the WASM module:", error);
    throw new Error(`Garaga initialization failed: ${error}`);
  }
}

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

  const x = mod(
    (5n * a + a * y_twisted - 5n * d * y_twisted - d) *
      modPow(12n - 12n * y_twisted, -1n, p),
    p,
  );
  const y = mod(
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
  const y = mod(
    (5n * a - 12n * x_weierstrass - d) *
      modPow(-12n * x_weierstrass - a + 5n * d, -1n, p),
    p,
  );
  const x = mod(
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
 * Get the coordinates of a list of points for a specified curve.
 *
 * @param {Point[]} points - An array of point objects to convert into coordinates.
 * @param {CurveName} curveName - The name of the curve. Supported values are `CurveName.ED25519` and `CurveName.SECP256K1`.
 * @returns {[bigint, bigint][]} An array of coordinate pairs (tuples) as [x, y], where both x and y are bigints.
 *
 * @throws {Error} If the provided curveName is not supported.
 */
function getPointCoordinates(
  points: Point[],
  curveName: CurveName,
): [bigint, bigint][] {
  switch (curveName) {
    case CurveName.ED25519:
      return points.map((point) => {
        const [x, y] = toWeierstrass(
          ED25519_CONSTANTS.A,
          ED25519_CONSTANTS.D,
          ED25519_CONSTANTS.P,
          point.x,
          point.y,
        );
        return [x, y];
      });
    case CurveName.SECP256K1:
      return points.map((point) => point.toCoordinates());
    default:
      throw new Error(`Curve ${curveName} not supported`);
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function getCurveId(curveName: CurveName, garaga: any): number {
  switch (curveName) {
    case CurveName.ED25519:
      return garaga.CurveId.X25519;
    case CurveName.SECP256K1:
      return garaga.CurveId.SECP256K1;
    default:
      throw new Error(`Curve ${curveName} not supported for Garaga operations`);
  }
}

/**
 * Computes and returns the MSM (Multi-Scalar Multiplication) hint for a given set of points and scalars.
 * This function uses the Garaga library to generate a hint for efficient MSM computation.
 *
 * @param points An array of points.
 * @param scalars An array of bigint scalars corresponding to the point multiplier.
 * @returns A Promise that resolves to a bigint array containing the MSM hint.
 * @throws Will throw an error if the Garaga library fails to initialize or if the MSM calldata building fails.
 */
export async function prepareGaragaHints(
  points: Point[],
  scalars: bigint[],
): Promise<bigint[]> {
  const curveName = points[0].curve.name;
  const pointCoordinates = getPointCoordinates(points, curveName);
  const garaga = await initGaraga();
  const curveId = getCurveId(curveName, garaga);

  try {
    return garaga.msmCalldataBuilder(pointCoordinates, scalars, curveId, {
      includeDigitsDecomposition: false,
    });
  } catch (error) {
    console.error("Failed to perform Garaga operation:", error);
    throw new Error(`Garaga operation failed: ${error}`);
  }
}
