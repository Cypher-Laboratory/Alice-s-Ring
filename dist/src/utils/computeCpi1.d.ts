import { Point } from "../point";
import { SignatureConfig } from "../interfaces";
import { Curve } from "../curves";
/**
 * Compute the value of Cpi+1
 *
 * @param message the message to sign digested
 * @param curve the curve to use
 * @param alpha the nonce value
 * @param config the config to use
 * @param ring the ring involved in the ring signature
 *
 * @returns the value of c1
 */
export declare function computeCPI1(message: bigint, // = c in our ring signature scheme
curve: Curve, alpha?: bigint, config?: SignatureConfig, ring?: Point[]): bigint;
