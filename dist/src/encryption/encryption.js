"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEncryptionPubKey = exports.decrypt = exports.encrypt = void 0;
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const concatUint8Array_1 = require("../utils/formatData/concatUint8Array");
/**
 * Encrypts the data using the public key and encryptSafely function
 *
 * @param data - The data to encrypt
 * @param pubKey - The public key to encrypt the data with
 *
 * @returns The encrypted data as a base64 string
 */
function encrypt(data, encryptionPubKey) {
    const version = "x25519-xsalsa20-poly1305";
    // encrypt data
    const encryptedData = (0, eth_sig_util_1.encryptSafely)({
        publicKey: encryptionPubKey,
        version,
        data,
    });
    return encryptedData;
}
exports.encrypt = encrypt;
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
function decrypt(data, privKey) {
    const privKeyBuffer = Buffer.from(privKey.toString(16), "hex");
    const privKeyArray = new Uint8Array(privKeyBuffer).slice(0, 32);
    let paddedPrivKey;
    // check if the private key is 32 bytes
    if (privKeyArray.length < 32) {
        // pad the private key with 0s to the right
        paddedPrivKey = (0, concatUint8Array_1.concatUint8Array)(privKeyArray, new Uint8Array(32 - privKeyArray.length));
    }
    else {
        // truncate the private key to 32 bytes
        paddedPrivKey = privKeyArray;
    }
    // convert the padded private key to a hex string
    privKey = BigInt("0x" + Buffer.from(paddedPrivKey).toString("hex"));
    return (0, eth_sig_util_1.decryptSafely)({
        encryptedData: data,
        privateKey: privKey.toString(16),
    });
}
exports.decrypt = decrypt;
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
function getEncryptionPubKey(privateKey) {
    const privKeyBuffer = Buffer.from(privateKey.toString(16), "hex");
    const privKeyArray = new Uint8Array(privKeyBuffer).slice(0, 32);
    let paddedPrivKey;
    // check if the private key is 32 bytes
    if (privKeyArray.length < 32) {
        // pad the private key with 0s to the right
        paddedPrivKey = (0, concatUint8Array_1.concatUint8Array)(privKeyArray, new Uint8Array(32 - privKeyArray.length));
    }
    else {
        // truncate the private key to 32 bytes
        paddedPrivKey = privKeyArray;
    }
    // convert the padded private key to a hex string
    privateKey = BigInt("0x" + Buffer.from(paddedPrivKey).toString("hex"));
    return (0, eth_sig_util_1.getEncryptionPublicKey)(privateKey.toString(16));
}
exports.getEncryptionPubKey = getEncryptionPubKey;
