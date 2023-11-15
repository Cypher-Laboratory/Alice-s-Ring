import { Curve, CurveName, Point } from "../../src";
import { notOnCurve } from "../../src/errors";
import {
  valid_coordinates_ed25519,
  valid_coordinates_secp256k1,
} from "../data";
describe("Point class constructor tests", () => {
  let mockED25519: Curve;
  let mockSECP256K1: Curve;

  beforeEach(() => {
    mockED25519 = new Curve(CurveName.ED25519); // Replace with actual initialization if necessary
    mockSECP256K1 = new Curve(CurveName.SECP256K1); // Replace with actual initialization if necessary
  });

  it("should create a point successfully with valid parameters, ED25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    expect(point).toBeInstanceOf(Point);
    expect(point.x).toBe(valid_coordinates_ed25519[0]);
    expect(point.y).toBe(valid_coordinates_ed25519[1]);
  });

  it("should create a point successfully with valid parameters, SECP256K1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);

    expect(point).toBeInstanceOf(Point);
    expect(point.x).toBe(valid_coordinates_secp256k1[0]);
    expect(point.y).toBe(valid_coordinates_secp256k1[1]);
  });

  it("should throw notOnCurve error when point is not on the curve, ED25519", () => {
    const x = BigInt(10);
    const y = BigInt(20);

    expect(() => new Point(mockED25519, [x, y])).toThrow(
      notOnCurve(`[${x}, ${y}]`),
    );
  });

  it("should throw notOnCurve error when point is not on the curve, SECP256K1", () => {
    const x = BigInt(10);
    const y = BigInt(20);

    expect(() => new Point(mockSECP256K1, [x, y])).toThrow(
      notOnCurve(`[${x}, ${y}]`),
    );
  });
});
