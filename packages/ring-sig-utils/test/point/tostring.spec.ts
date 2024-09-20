import { Curve, CurveName, Point } from "../../src";
import {
  valid_coordinates_ed25519,
  valid_coordinates_secp256k1,
} from "../data";
describe("Point class toString()", () => {
  let mockED25519: Curve;
  let mockSECP256K1: Curve;

  beforeEach(() => {
    mockED25519 = new Curve(CurveName.ED25519); // Replace with actual initialization if necessary
    mockSECP256K1 = new Curve(CurveName.SECP256K1); // Replace with actual initialization if necessary
  });

  it("should return a string representation of the point, ed25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    expect(() => JSON.parse(point.toString())).not.toThrow();
  });
  it("should return a string representation of the point, secp256k1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    expect(() => JSON.parse(point.toString())).not.toThrow();
  });
});
