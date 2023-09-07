export declare function altSchnorrSignature(message: string, privateKey: bigint, alpha?: bigint): [bigint, bigint];
export declare function altSchnorrVerify(message: string, publicKey: [bigint, bigint], signature: [bigint, bigint]): boolean;
