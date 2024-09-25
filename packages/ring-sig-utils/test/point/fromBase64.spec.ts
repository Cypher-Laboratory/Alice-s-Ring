import { Point } from "../../src";
import * as data from "../data";
describe("Point class mult operation tests", () => {
  it("Should return a valid Point from it's base64 representation, ed25519", () => {
    const point = Point.fromBase64(data.base64Point.valid_point_ed25519);
    expect(point).toBeInstanceOf(Point);
  });

  it("Should return a valid Point from it's base64 representation, secp256k1", () => {
    const point = Point.fromBase64(data.base64Point.valid_point_secp256k1);
    expect(point).toBeInstanceOf(Point);
  });

  it("should throw an error if the base64 string is not valid, ed25519", () => {
    expect(() =>
      Point.fromBase64(data.base64Point.invalid_point_ed25519),
    ).toThrow();
  });

  it("should throw an error if the base64 string is not valid, secp256k1", () => {
    expect(() =>
      Point.fromBase64(data.base64Point.invalid_point_secp256k1),
    ).toThrow();
  });

  it("should throw if the string is void", () => {
    expect(() => Point.fromBase64("")).toThrow();
  });
});
