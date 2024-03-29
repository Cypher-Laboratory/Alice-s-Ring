import * as data from "../data";
import { isRingSorted } from "../../src/utils/isRingSorted";
import { sortRing } from "../../src/ringSignature";

describe("Test isRingSorted() SECP256K1", () => {
  it("Should return true if the ring is sorted", () => {
    expect(isRingSorted(data.publicKeys_secp256k1,
        )).toBe(true);
  });
});

describe("Test isRingSorted() ED25519", () => {
    it("Should return true if the ring is sorted", () => {
      expect(isRingSorted(data.publicKeys_ed25519)).toBe(true);
    });
});

describe("Test sortRing() SECP256K1", () => {
    it("Should return a sorted ring", () => {
        const sortedRing = sortRing(data.unsortedPublicKeys_secp256k1);
        expect(isRingSorted(sortedRing)).toBe(true);
    });
});

describe("Test sortRing() ED25519", () => {
    it("Should return a sorted ring", () => {
        const sortedRing = sortRing(data.unsortedPublicKeys_ed25519);
        expect(isRingSorted(sortedRing)).toBe(true);
    });
});




