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

  it("Should return a valid base64 encoded string, ed25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    expect(() => Buffer.from(point.toBase64(), "base64")).not.toThrow();
  });

  it("Should return a valid base64 encoded string, secp256k1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    expect(() => Buffer.from(point.toBase64(), "base64")).not.toThrow();
  });

  it("Should return a valid Point, ed25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    expect(Point.fromBase64(point.toBase64())).toBeInstanceOf(Point);
  });

  it("Should return a valid Point, secp256k1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    expect(Point.fromBase64(point.toBase64())).toBeInstanceOf(Point);
  });
});
