import { Curve } from "../curves";
/**
 * Compute the signature from the actual signer
 *
 * @remarks
 * This function is used to compute the signature of the actual signer in a ring signature scheme.
 *
 * @param alpha - the alpha value
 * @param c - the seed
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
export declare function piSignature(alpha: bigint, c: bigint, signerPrivKey: bigint, curve: Curve): bigint;
