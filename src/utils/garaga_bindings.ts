import { Point } from "../point";
import { modPow } from "./modPow";
import { modulo } from "./modulo";
import { CurveName } from "../curves";
import { IGaragaHints } from "../interfaces";
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

/*
 * wrapper function around toWeirstrass to use with the Point class
 */
export function pointToWeirstrass(p: Point) {
  switch (p.curve.name) {
    case CurveName.ED25519: {
      return toWeierstrass(
        57896044618658097711785492504343953926634992332820282019728792003956564819948n,
        37095705934669439343138083508754565189542113879843219016388785533085940283555n,
        57896044618658097711785492504343953926634992332820282019728792003956564819949n,
        p.x,
        p.y,
      );
    }
    default:
      throw new Error(`Curve ${p.curve.name} not supported`);
  }
}

export async function prepare_garaga_hint(
  points: [bigint, bigint][], // Temporarily use 'any' for G1Point
  scalars: bigint[],
): Promise<IGaragaHints> {
  // Return type might need to be adjusted
  try {
    const garaga = await import("garaga");

    await garaga.init();

    const result = garaga.msmCalldataBuilder(
      points,
      scalars,
      garaga.CurveId.X25519,
    );
    const hint: IGaragaHints = {
      points,
      scalars,
      hint: result,
      curve_index: 4n,
    };
    return hint;
  } catch (error) {
    console.error(
      "Failed to initialize the WASM module or perform operation:",
      error,
    );
    throw error;
  }
}
