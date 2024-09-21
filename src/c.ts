interface Uint384 {
  limb0: string;
  limb1: string;
  limb2: string;
  limb3: string;
}

function convertToBigInt(uint384: Uint384): bigint {
  // Convert each limb to BigInt
  const limb0 = BigInt(uint384.limb0);
  const limb1 = BigInt(uint384.limb1);
  const limb2 = BigInt(uint384.limb2);
  const limb3 = BigInt(uint384.limb3);

  // Calculate the shifts
  const shift96 = BigInt(2) ** BigInt(96);
  const shift192 = BigInt(2) ** BigInt(192);
  const shift288 = BigInt(2) ** BigInt(288);

  // Combine the limbs
  return limb0 + limb1 * shift96 + limb2 * shift192 + limb3 * shift288;
}

// Example usage
const x: Uint384 = {
  limb0: "0x5c873c00a39e67ad5a996d93",
  limb1: "0xe66da011021f496e05bdff62",
  limb2: "0x25f369fd4f77b013",
  limb3: "0x00",
};
const x1: Uint384 = {
  limb0: "0x494e2f8e8b0b4a60e9e7ec53",
  limb1: "0x67917de0829c90f265be09c2",
  limb2: "0x455c71352368fe0c",
  limb3: "0x00",
};

const x2: Uint384 = {
  limb0: "0x675a4969b184f88bc63dc62e",
  limb1: "0x911354ecc608a08928224f65",
  limb2: "0x46b7c90c6f0269b4",
  limb3: "0x00",
};
const bigIntResult = convertToBigInt(x);
const bigx1 = convertToBigInt(x1);
const bigx2 = convertToBigInt(x2);
console.log(bigIntResult.toString());
console.log(bigx1.toString());
console.log(bigx2.toString());
