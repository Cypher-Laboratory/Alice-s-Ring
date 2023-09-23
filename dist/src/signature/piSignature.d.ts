import { Curve } from "../utils";
/**
 * Compute the signature from the actual signer
 *
 * @param alpha - the alpha value
 * @param c - the c[pi] value
 * @param signerPrivKey - the private key of the signer
 * @param Curve - the curve to use
 *
 * @returns the signer response as a point on the curve
 */
export declare function piSignature(alpha: bigint, c: bigint, signerPrivKey: bigint, curve: Curve): bigint;
