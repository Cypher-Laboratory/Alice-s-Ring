import { Curve, CurveName, Point } from "../../src";
import {
  valid_coordinates_ed25519,
  valid_coordinates_secp256k1,
  valid_coordinates_U384_ed25519,
  valid_coordinates_U384_secp256k1,
} from "../data";
describe("Point class toCoordinates()", () => {
  let mockED25519: Curve;
  let mockSECP256K1: Curve;

  beforeEach(() => {
    mockED25519 = new Curve(CurveName.ED25519); // Replace with actual initialization if necessary
    mockSECP256K1 = new Curve(CurveName.SECP256K1); // Replace with actual initialization if necessary
  });

  it("should return a [bigint, bigint], ED25519", () => {
    const point = new Point(mockED25519, valid_coordinates_ed25519);
    const u384Coordinate = point.toU384Coordinates();
    expect(u384Coordinate).toBeInstanceOf(Array);
    expect(u384Coordinate[0]).toEqual(valid_coordinates_U384_ed25519[0]);
    expect(u384Coordinate[1]).toEqual(valid_coordinates_U384_ed25519[1]);
  });

  it("should return a [bigint, bigint], SECP256K1", () => {
    const point = new Point(mockSECP256K1, valid_coordinates_secp256k1);
    const u384Coordinate = point.toU384Coordinates();
    expect(u384Coordinate).toBeInstanceOf(Array);
    expect(u384Coordinate[0]).toEqual(valid_coordinates_U384_secp256k1[0]);
    expect(u384Coordinate[1]).toEqual(valid_coordinates_U384_secp256k1[1]);
  });
});
