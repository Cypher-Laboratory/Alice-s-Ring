export { randomBigint, getRandomSecuredNumber } from "./randomNumbers";
export { modulo } from "./modulo";
export { uint8ArrayToHex } from "./convertTypes/uint8ArrayToHex";
export { formatRing } from "./formatData/formatRing";
export { formatPoint } from "./formatData/formatPoint";
export { keccak256, hash, sha_512 } from "./hashFunction";
export { computeCPI1 } from "./computeCpi1";
export const base64Regex =
  // eslint-disable-next-line no-useless-escape
  /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
