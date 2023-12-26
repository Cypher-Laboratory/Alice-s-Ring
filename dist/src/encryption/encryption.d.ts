import { EthEncryptedData } from "@metamask/eth-sig-util";
/**
 * Encrypts the data using the public key and encryptSafely function
 *
 * @param data - The data to encrypt
 * @param pubKey - The public key to encrypt the data with
 *
 * @returns The encrypted data as a base64 string
 */
export declare function encrypt(data: string, encryptionPubKey: string): EthEncryptedData;
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
export declare function decrypt(data: EthEncryptedData, privKey: bigint): string;
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
export declare function getEncryptionPubKey(privateKey: bigint): string;
