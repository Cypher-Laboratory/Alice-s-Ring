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

  it("should return true points are equals, ED25519", () => {
    const point1 = new Point(mockED25519, valid_coordinates_ed25519);
    const point2 = new Point(mockED25519, valid_coordinates_ed25519);
    expect(point1.equals(point2)).toBeTruthy();
  });

  it("should return true points are equals, SECP256K1", () => {
    const point1 = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const point2 = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    expect(point1.equals(point2)).toBeTruthy();
  });

  it("should return false points are not equals, ED25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    const point2 = new Point(mockED25519, valid_coordinates_ed25519);
    point2.x = BigInt(0);
    point2.y = BigInt(0);
    expect(point.equals(point2)).toBeFalsy();
  });

  it("should return false points are not equals, SECP256K1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const point2 = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    point2.x = BigInt(0);
    point2.y = BigInt(0);
    expect(point.equals(point2)).toBeFalsy();
  });
});
