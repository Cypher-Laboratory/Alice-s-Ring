import { Point } from "../point";
import { Curve } from "../curves";
import { SignatureConfig } from "../interfaces";
/**
 * Compute a Schnorr signature
 *
 * @param message - The message digest (as bigint)
 * @param signerPrivKey - The signer private key
 * @param curve - The curve to use
 * @param alpha - The alpha value (optional)
 * @param config - The signature config (optional)
 * @param keyPrefixing - Whether to prefix the hashed data with the public key (default: true)
 *
 * @returns { messageDigest: bigint, c: bigint, r: bigint } - The signature { messageDigest, c, r }
 */
export declare function schnorrSignature(message: bigint, signerPrivKey: bigint, curve: Curve, alpha?: bigint, config?: SignatureConfig, keyPrefixing?: boolean): {
    messageDigest: bigint;
    c: bigint;
    r: bigint;
    ring?: Point[];
};
/**
 * Verify a signature generated with the `schnorrSignature` function
 *
 * @param message - The message (as bigint) (= c[pi] in our ring signature scheme)
 * @param signerPubKey - The signer public key
 * @param signature - The signature { c, r }
 * @param curve - The curve to use
 * @param config - The signature config
 * @param keyPrefixing - Whether to prefix the hashed data with the public key (default: true)
 *
 * @returns true if the signature is valid, false otherwise
 */
export declare function verifySchnorrSignature(message: bigint, signerPubKey: Point, signature: {
    c: bigint;
    r: bigint;
}, curve: Curve, config?: SignatureConfig, keyPrefixing?: boolean): boolean;
