import { Uint384 } from "@cypher-laboratory/ring-sig-utils";
import { CairoG1Point } from "./CairoG1Point";
/**
 * Generates call data for a ring signature verification function.
 *
 * This function takes the components of a ring signature and converts them into
 * a flat array of bigints, which can be used as call data for a smart contract.
 *
 * @param {Uint384} message_digest - The message digest, represented as a Uint384.
 * @param {Uint384} challenge - The challenge value, represented as a Uint384.
 * @param {CairoG1Point[]} ring - An array of points on the elliptic curve, representing the ring.
 * @param {bigint[][]} hints - A 2D array of bigints, representing additional data used in the verification process.
 *
 * @returns {bigint[]} An array of bigints representing the formatted call data.
 *
 * @remarks
 * The function structures the call data as follows:
 * 1. Message digest (4 limbs)
 * 2. Challenge (4 limbs)
 * 3. Ring length
 * 4. Ring points (each point is 8 limbs: 4 for x-coordinate, 4 for y-coordinate)
 * 5. Number of hint arrays
 * 6. Hint arrays (each array is flattened and concatenated)
 *
 * Each Uint384 is expected to have properties limb0, limb1, limb2, and limb3.
 * CairoG1Point is expected to have properties x and y, each of type Uint384.
 */
export declare function generateCallData(message_digest: Uint384, challenge: Uint384, ring: CairoG1Point[], hints: bigint[][]): bigint[];
