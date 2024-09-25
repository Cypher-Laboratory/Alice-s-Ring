import { Curve, CurveName, Point } from "../../src";
import {
  valid_coordinates_ed25519,
  valid_coordinates_secp256k1,
} from "../data";
describe("Point class add operation tests", () => {
  let mockED25519: Curve;
  let mockSECP256K1: Curve;

  beforeEach(() => {
    mockED25519 = new Curve(CurveName.ED25519); // Replace with actual initialization if necessary
    mockSECP256K1 = new Curve(CurveName.SECP256K1); // Replace with actual initialization if necessary
  });

  it("should add a point with a valid point correctly, ED25519", () => {
    const point1 = new Point(mockED25519, valid_coordinates_ed25519);
    const point2 = new Point(mockED25519, valid_coordinates_ed25519);
    const result = point1.add(point2);
    expect(result).toBeInstanceOf(Point);
  });

  it("should mult a point with a valid point correctly, SECP256K1", () => {
    const point1 = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const point2 = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const result = point1.add(point2);
    expect(result).toBeInstanceOf(Point);
  });
});
