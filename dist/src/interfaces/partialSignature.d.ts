import { Curve } from "../curves";
import { Point } from "../point";
import { SignatureConfig } from "./signatureConfig";
/**
 * Partial ring signature interface
 *
 * @see message - Clear message
 * @see ring - Ring of public keys
 * @see pi - The signer index -> should be kept secret
 * @see c - The first c computed during the first part of the signing
 * @see cpi - The c value of the signer
 * @see alpha - The alpha value
 * @see responses - The generated responses
 * @see curve - The elliptic curve to use
 * @see config - The config params to use (optional)
 */
export interface PartialSignature {
    message: string;
    ring: Point[];
    pi: number;
    c: bigint;
    cpi: bigint;
    alpha: bigint;
    responses: bigint[];
    curve: Curve;
    config?: SignatureConfig;
}
