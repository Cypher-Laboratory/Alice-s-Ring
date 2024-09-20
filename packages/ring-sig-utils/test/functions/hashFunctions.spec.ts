import { keccak_256 } from "../../src/utils/hashFunction";

// todo: test all hashing functions

/**
 * Test keccak_256()
 */
describe("Test keccak_256", () => {
  it("Should return true if the hash matches the expected value", () => {
    const msg = "Hello world !";

    const hash = keccak_256([msg]);
    expect(hash).toBe(
      "f1eec9d69e813dd791594452da1d21b20452423e6786af96190186ec71b1ed99",
    );
  });

  it("Should return true if the hash matches the expected value when hashing with evmCompatibility", () => {
    const msg = "Hello world !";

    const hash = keccak_256([msg], true);
    expect(hash).toBe(
      "f1eec9d69e813dd791594452da1d21b20452423e6786af96190186ec71b1ed99",
    );
  });

  it("Should return true if the hash matches the expected value when hashing multiple values", () => {
    const msg = "Hello world !";
    const msg2 = "Hello world !";

    const hash = keccak_256([msg, msg2]);
    expect(hash).toBe(
      "c84332dd50d5baa831830eeb3ddfe19785aa997c048e5963b7a382250921e342",
    );
  });

  it("Should return true if the hash matches the expected value when hashing multiple values with evmCompatibility", () => {
    const msg = "Hello world !";
    const msg2 = "Hello world !";

    const hash = keccak_256([msg, msg2], true);
    expect(hash).toBe(
      "c84332dd50d5baa831830eeb3ddfe19785aa997c048e5963b7a382250921e342",
    );
  });

  it("Should return true if the hash matches the expected value (msg is bigint)", () => {
    const msg = 123456789n;

    const hash = keccak_256([msg]);
    expect(hash).toBe(
      "2a359feeb8e488a1af2c03b908b3ed7990400555db73e1421181d97cac004d48",
    );
  });

  it("Should return true if the hash matches the expected value when hashing with evmCompatibility (msg is bigint)", () => {
    const msg = 123456789n;

    const hash = keccak_256([msg], true);
    expect(hash).toBe(
      "f395757e0d74803aae4e8adb875451d99622e911b61c64e044e0bd16a16f18cd",
    );
  });

  it("Should return true if the hash matches the expected value when hashing multiple values (strings and bigints)", () => {
    const msg = "Hello world !";
    const msg2 = 123456789n;

    const hash = keccak_256([msg, msg2]);
    expect(hash).toBe(
      "51173941f1fd9ebb39c5e3b267b578eb49c764a32738d797883ea2afcd55a580",
    );
  });

  it("Should return true if the hash matches the expected value when hashing multiple values with evmCompatibility (msg is array of strings and bigints)", () => {
    const msg = "Hello world !";
    const msg2 = 123456789n;

    const hash = keccak_256([msg, msg2], true);
    expect(hash).toBe(
      "3595b9ebcda889fe5586814dd26d0a902708ac45f4b674c671a799346185bf86",
    );
  });
});
