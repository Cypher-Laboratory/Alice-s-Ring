import { Curve, CurveName, Point } from "../../src";
import {
  valid_coordinates_ed25519,
  valid_coordinates_secp256k1,
  idPointX_ed25519,
  idPointX_secp256k1,
} from "../data";
describe("Point class isValid()", () => {
  let mockED25519: Curve;
  let mockSECP256K1: Curve;

  beforeEach(() => {
    mockED25519 = new Curve(CurveName.ED25519); // Replace with actual initialization if necessary
    mockSECP256K1 = new Curve(CurveName.SECP256K1); // Replace with actual initialization if necessary
  });

  it("should return true if the point is valid, ED25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    expect(point.isValid()).toBeTruthy();
  });

  it("should return true if the point is valid, SECP256K1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    expect(point.isValid()).toBeTruthy();
  });

  it("should return false if the point is invalid, ED25519", () => {
    expect(idPointX_ed25519.isValid()).toBeFalsy();
  });

  it("should return false if the point is invalid, SECP256K1", () => {
    expect(idPointX_secp256k1.isValid()).toBeFalsy();
  });
});
