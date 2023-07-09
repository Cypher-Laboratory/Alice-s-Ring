import {
    getRandomValues, // generation reellement aleatoire ?
} from "crypto";

export const randomBigint = (max: bigint): bigint => {
    const maxBytes = max.toString(16).length;
    const randomBytes = getRandomValues(new Uint8Array(maxBytes));
    const randomHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const randomBig = BigInt('0x' + randomHex);
    return randomBig % max;
}