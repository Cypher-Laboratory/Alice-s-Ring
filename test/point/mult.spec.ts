import { Curve, CurveName, Point } from "../../src";
import {
  valid_coordinates_ed25519,
  valid_coordinates_secp256k1,
} from "../data";
describe("Point class mult operation tests", () => {
  let mockED25519: Curve;
  let mockSECP256K1: Curve;

  beforeEach(() => {
    mockED25519 = new Curve(CurveName.ED25519); // Replace with actual initialization if necessary
    mockSECP256K1 = new Curve(CurveName.SECP256K1); // Replace with actual initialization if necessary
  });

  it("should mult a point with a positif scalar correctly, ED25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    const scalar = BigInt(10);
    const result = point.mult(scalar);
    expect(result).toBeInstanceOf(Point);
  });

  it("should mult a point with a positif scalar correctly, SECP256K1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const scalar = BigInt(10);
    const result = point.mult(scalar);
    expect(result).toBeInstanceOf(Point);
  });

  it("should mult a point with a negatif scalar correctly, ED25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    const scalar = BigInt(-10);
    const result = point.mult(scalar);
    expect(result).toBeInstanceOf(Point);
  });

  it("should mult a point with a negatif scalar correctly, SECP256K1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const scalar = BigInt(-10);
    const result = point.mult(scalar);
    expect(result).toBeInstanceOf(Point);
  });

  it("should throw compututation error if the scalar equal 0, ED25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    const scalar = BigInt(0);
    expect(() => point.mult(scalar)).toThrow(
      `Computation error: invalid scalar`,
    );
  });

  it("should throw computation error when point is not on the curve, SECP256K1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const scalar = BigInt(0);
    expect(() => point.mult(scalar)).toThrow(
      `Computation error: invalid scalar`,
    );
  });
});
