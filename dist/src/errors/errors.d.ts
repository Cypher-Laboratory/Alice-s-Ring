export declare const noEmptyRing: Error;
export declare const invalidSignature: Error;
export declare const computationError: (data?: string) => Error;
/**
 * @param l1 - name of first parameter
 * @param l2 - name of second parameter
 * @returns Error object
 */
export declare const lengthMismatch: (l1?: string, l2?: string) => Error;
export declare const noDuplicates: (varName?: string) => Error;
/**
 * @param data - var name
 * @param min - min value
 * @returns Error object
 */
export declare const tooSmall: (data?: string, min?: number | bigint) => Error;
/**
 * @param data - var name
 * @param max - max value
 * @returns Error object
 */
export declare const tooBig: (data?: string, max?: number | bigint) => Error;
export declare const invalidParams: (data?: string) => Error;
export declare const missingParams: (data?: string) => Error;
export declare const invalidJson: (data?: string | unknown) => Error;
export declare const invalidBase64: (data?: string) => Error;
export declare const invalidPoint: (data?: string) => Error;
export declare const notOnCurve: (data?: string) => Error;
export declare const invalidCoordinates: (data?: string) => Error;
export declare const unknownCurve: (data?: string) => Error;
export declare const invalidCurve: (data?: string) => Error;
export declare const differentCurves: (data?: string) => Error;
export declare const curveMismatch: (data?: string) => Error;
export declare const noEmptyResponses: Error;
export declare const invalidResponses: Error;
export declare const invalidRing: (data?: string) => Error;
