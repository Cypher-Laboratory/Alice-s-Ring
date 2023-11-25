import {
  EthEncryptedData,
  decryptSafely,
  encryptSafely,
  getEncryptionPublicKey,
} from "@metamask/eth-sig-util";
import { concatUint8Array } from "../utils/formatData/concatUint8Array";

/**
 * Encrypts the data using the public key and encryptSafely function
 *
 * @param data - The data to encrypt
 * @param pubKey - The public key to encrypt the data with
 *
 * @returns The encrypted data as a base64 string
 */
export function encrypt(
  data: string,
  encryptionPubKey: string,
): EthEncryptedData {
  const version = "x25519-xsalsa20-poly1305";

  // encrypt data
  const encryptedData = encryptSafely({
    publicKey: encryptionPubKey,
    version,
    data,
  });

  return encryptedData;
}

/**
 * Decrypts the data using the private key
 *
 * @remarks
 * This function is a wrapper around the encryptSafely function from the eth-sig-util package
 * The expected private key size is 32 bytes. If it is not 32 bytes, it will be padded with 0s to the right
 * If the private key is larger than 32 bytes, it will be truncated to 32 bytes
 *
 * @param data - The data to decrypt
 * @param privKey - The private key to decrypt the data with
 *
 * @returns The decrypted data as a string
 */
export function decrypt(data: EthEncryptedData, privKey: bigint): string {
  const privKeyBuffer = Buffer.from(privKey.toString(16), "hex");
  const privKeyArray = new Uint8Array(privKeyBuffer).slice(0, 32);
  let paddedPrivKey: Uint8Array;
  // check if the private key is 32 bytes
  if (privKeyArray.length < 32) {
    // pad the private key with 0s to the right
    paddedPrivKey = concatUint8Array(
      privKeyArray,
      new Uint8Array(32 - privKeyArray.length),
    );
  } else {
    // truncate the private key to 32 bytes
    paddedPrivKey = privKeyArray;
  }

  // convert the padded private key to a hex string
  privKey = BigInt("0x" + Buffer.from(paddedPrivKey).toString("hex"));

  return decryptSafely({
    encryptedData: data,
    privateKey: privKey.toString(16),
  });
}

/**
 * Gets the encryption public key from the private key
 *
 * @remarks
 * This function is a wrapper around the encryptSafely function from the eth-sig-util package
 * The expected private key size is 32 bytes. If it is not 32 bytes, it will be padded with 0s to the right
 * If the private key is larger than 32 bytes, it will be truncated to 32 bytes
 *
 * @param privateKey - The private key to get the public key from
 *
 * @returns The encryption public key as a string
 */
export function getEncryptionPubKey(privateKey: bigint): string {
  const privKeyBuffer = Buffer.from(privateKey.toString(16), "hex");
  const privKeyArray = new Uint8Array(privKeyBuffer).slice(0, 32);
  let paddedPrivKey: Uint8Array;
  // check if the private key is 32 bytes
  if (privKeyArray.length < 32) {
    // pad the private key with 0s to the right
    paddedPrivKey = concatUint8Array(
      privKeyArray,
      new Uint8Array(32 - privKeyArray.length),
    );
  } else {
    // truncate the private key to 32 bytes
    paddedPrivKey = privKeyArray;
  }

  // convert the padded private key to a hex string
  privateKey = BigInt("0x" + Buffer.from(paddedPrivKey).toString("hex"));
  return getEncryptionPublicKey(privateKey.toString(16));
}
