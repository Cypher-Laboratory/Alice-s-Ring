# types-Ring-Signature

This repository contains a TypeScript implementation of the [Ring Signature](https://en.wikipedia.org/wiki/Ring_signature) algorithm using Spontaneous Anonymous Group (SAG).

## About the implementation

The implementation is based on the [SAG algorithm](https://eprint.iacr.org/2004/027.pdf) and uses the [Elliptic Curve Cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) (ECC) to generate the keys and sign the message.

We used the implementation proposed in [Zero to Monero](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) (p.36) as a reference.


## Usage

```typescript
import { RingSignature } from '@cypherlab/types-ring-signature';

const curve: Curve = new Curve(CurveName.SECP256K1);
const ring: Point[] = []; // your ring of public keys
const message = 'Hello World!';

const signerPrivateKey = BigInt('your private key');

// Sign
const signature: RingSignature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve,
);

// Verify
console.log(
  "Is signature verified? ", signature.verify()
);

// Export to jsonString
const jsonString = signature.toJsonString();

// Import from jsonString
const retrievedFromJson = RingSignature.fromJsonString(jsonString);
```

## Dependencies

| Dependency        | Version | repo                                    |audit report                                     |
|-------------------|---------|-----------------------------------------|-------------------------------------------------|
| @noble/hashes     | ^1.3.2  |[GitHub](https://github.com/paulmillr/noble-hashes)|[Report](https://cure53.de/pentest-report_hashing-libs.pdf)|

## Dev Dependencies

| Dev Dependency                      | Version  | Repository                                                                          |
|-------------------------------------|----------|-------------------------------------------------------------------------------------|
| @types/jest                         | ^29.5.7  | [GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jest) |
| @types/node                         | ^20.8.7  | [GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node) |
| @typescript-eslint/eslint-plugin    | ^5.61.0  | [GitHub](https://github.com/typescript-eslint/typescript-eslint)                    |
| @typescript-eslint/parser           | ^5.61.0  | [GitHub](https://github.com/typescript-eslint/typescript-eslint)                    |
| eslint                              | ^8.44.0  | [GitHub](https://github.com/eslint/eslint)                                          |
| jest                                | ^29.7.0  | [GitHub](https://github.com/facebook/jest)                                          |
| prettier                            | ^3.0.0   | [GitHub](https://github.com/prettier/prettier)                                      |
| ts-jest                             | ^29.1.1  | [GitHub](https://github.com/kulshekhar/ts-jest)                                     |
| ts-node                             | ^10.9.1  | [GitHub](https://github.com/TypeStrong/ts-node)                                     |

## Detailled implementation 

### RingSignature.sign

This method is use to compute a ring signature base on the spec discribe in [Zero to Monero](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) (p.36).

#### 1. Generate a random number π
It will be use as the signer index.
- **Function:** `getRandomSecuredNumber`
- **Location:** `src/utils/randomNumber.ts`
- **Description:** Generates a random number in [min, max].

**Code Snippet:**
```typescript
/**
 * generate a random number in [min, max]
 *
 * @param min the min value of the random number
 * @param max the max value of the random number
 * @returns the random number
 */
export function getRandomSecuredNumber(min: number, max: number): number {
 // function implementation
}
```
#### 2. Generate Random Number α
It will be use as the nonce.
- **Function:** `randomBigint`
- **Location:** `src/utils/randomNumber.ts`
- **Description:** Generates a random bigint in the range [1, max].

**Code Snippet:**
```typescript
/**
 * Generate a random bigint in [1,max].
 *
 * @param max The maximum value of the random number.
 * @returns The random bigint.
 */
export function randomBigint(max: bigint): bigint {
  // function implementation
}
```

#### 3. Compute Cπ+1
cπ+1 = Hn(R, m, [αG])
- **Function:** `computeC`
- **Location:** `src/ringSignatures.ts`
- **Description:** Compute a c value.
- **Remarks:**
   * This function is used to compute the c value of a ring-signature.
   * Either 'alpha' or all the other keys of 'params' must be set..

**Code Snippet:**
```typescript
/**
   * Compute a c value
   *
   * @remarks
   * This function is used to compute the c value of a ring-signature.
   * Either 'alpha' or all the other keys of 'params' must be set.
   *
   * @param ring - Ring of public keys
   * @param message - Message digest
   * @param G - Curve generator point
   * @param N - Curve order
   * @param params - The params to use
   * @param config - The config params to use
   *
   * @see params.previousR - The previous response which will be used to compute the new c value
   * @see params.previousC - The previous c value which will be used to compute the new c value
   * @see params.previousPubKey - The previous public key which will be used to compute the new c value
   * @see params.alpha - The alpha value which will be used to compute the new c value
   *
   * @returns A new c value
   */
  private static computeC(
    ring: Point[],
    messageDigest: bigint,
    params: {
      previousR?: bigint;
      previousC?: bigint;
      previousPubKey?: Point;
      alpha?: bigint;
    },
    curve: Curve,
    config?: SignatureConfig,
  ): bigint {
  // function implementation
}
```
#### 4. Compute the ring without the signer
For i = π + 1, π + 2, ..., n, 1, 2, ..., π − 1 calculate, replacing n + 1 → 1,

ci+1 = Hn(R, m, [riG + ciKi])

- **Function:** `RingSignature.signature`
- **Location:** `src/ringSignature.ts`
- **Description:** Generate an incomplete ring signature.

**Code Snippet:**
```typescript
/**
   * Generate an incomplete ring signature.
   *
   * @param curve - The curve to use
   * @param ring - The ring of public keys
   * @param ceePiPlusOne - The Cpi+1 value
   * @param signerIndex - The signer index in the ring
   * @param message - The message to sign
   * @param config - The config params to use
   *
   * @returns An incomplete ring signature
   */
  private static signature(
    curve: Curve,
    ring: Point[],
    ceePiPlusOne: bigint,
    signerIndex: number,
    messageDigest: bigint,
    config?: SignatureConfig,
  ): {
    ring: Point[];
    cees: bigint[];
    signerIndex: number;
    responses: bigint[];
  } {
  // function implementation
}
```

#### 5. Compute the true signer response rπ.
rπ such that α = rπ + cπkπ (mod l).
- **Function:** `piSignature`
- **Location:** `src/signature/piSignature.ts`
- **Description:** Compute the signature from the actual signer.

**Code Snippet:**
```typescript
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
export function piSignature(
  alpha: bigint,
  c: bigint,
  signerPrivKey: bigint,
  curve: Curve,
): bigint {
  // function implementation
}
```

#### 6. Return the ring signature
Return the ring-signature.
- **Function:** `constructor`
- **Location:** `src/ringSignature.ts`
- **Description:** Ring signature class constructor.

**Code Snippet:**
```typescript
 /**
   * Ring signature class constructor
   *
   * @param message - Clear message to sign
   * @param ring - Ring of public keys
   * @param cees - c values
   * @param responses - Responses for each public key in the ring
   * @param curve - Curve used for the signature
   * @param safeMode - If true, check if all the points are on the same curve
   * @param config - The config params to use (optional)
   */
  constructor(
    message: string,
    ring: Point[],
    c: bigint,
    responses: bigint[],
    curve: Curve,
    config?: SignatureConfig,
  ) {
  // function implementation
}
```
### RingSignature.partialSign
This method allow users to use their private keys stored in a wallet to create a ring signature.  
It is very similar to Ringsignature.sign as we maintain a stepwise approach, first addressing the ring and then the actual signature.   
The primary difference is that the nonce value is returned in step 4. For security purposes, this value is encrypted with the signer's public key, mitigating the risk of private key exposure

#### 1. Generate a random number π
It will be use as the signer index.
- **Function:** `getRandomSecuredNumber`
- **Location:** `src/utils/randomNumber.ts`
- **Description:** Generates a random number in [min, max].

**Code Snippet:**
```typescript
/**
 * generate a random number in [min, max]
 *
 * @param min the min value of the random number
 * @param max the max value of the random number
 * @returns the random number
 */
export function getRandomSecuredNumber(min: number, max: number): number {
 // function implementation
}
```
#### 2. Generate Random Number α
It will be use as the nonce.
- **Function:** `randomBigint`
- **Location:** `src/utils/randomNumber.ts`
- **Description:** Generates a random bigint in the range [1, max].

**Code Snippet:**
```typescript
/**
 * Generate a random bigint in [1,max].
 *
 * @param max The maximum value of the random number.
 * @returns The random bigint.
 */
export function randomBigint(max: bigint): bigint {
  // function implementation
}
```

#### 3. Compute Cπ+1
cπ+1 = Hn(R, m, [αG])
- **Function:** `computeC`
- **Location:** `src/ringSignatures.ts`
- **Description:** Compute a c value.
- **Remarks:**
   * This function is used to compute the c value of a ring-signature.
   * Either 'alpha' or all the other keys of 'params' must be set..

**Code Snippet:**
```typescript
/**
   * Compute a c value
   *
   * @remarks
   * This function is used to compute the c value of a ring-signature.
   * Either 'alpha' or all the other keys of 'params' must be set.
   *
   * @param ring - Ring of public keys
   * @param message - Message digest
   * @param G - Curve generator point
   * @param N - Curve order
   * @param params - The params to use
   * @param config - The config params to use
   *
   * @see params.previousR - The previous response which will be used to compute the new c value
   * @see params.previousC - The previous c value which will be used to compute the new c value
   * @see params.previousPubKey - The previous public key which will be used to compute the new c value
   * @see params.alpha - The alpha value which will be used to compute the new c value
   *
   * @returns A new c value
   */
  private static computeC(
    ring: Point[],
    messageDigest: bigint,
    params: {
      previousR?: bigint;
      previousC?: bigint;
      previousPubKey?: Point;
      alpha?: bigint;
    },
    curve: Curve,
    config?: SignatureConfig,
  ): bigint {
  // function implementation
}
```
#### 4. Compute the ring without the signer

For i = π + 1, π + 2, ..., n, 1, 2, ..., π − 1 calculate, replacing n + 1 → 1,

ci+1 = Hn(R, m, [riG + ciKi])
- **Function:** `RingSignature.partialSign`
- **Location:** `src/ringSignatures.ts`
- **Description:** Generate an incomplete ring signature (without the signer response).

**Code Snippet:**
```typescript
/**
   * Generate an incomplete ring signature (without the signer response)
   * Allow the user to use its private key from an external software (external software/hardware wallet)
   *
   * @param ring - Ring of public keys (does not contain the signer public key)
   * @param message - Clear message to sign
   * @param signerPubKey - Public key of the signer
   * @param config - The config params to use
   *
   * @returns A PartialSignature
   */
  static partialSign(
    ring: Point[], // ring.length = n
    message: string,
    signerPubKey: Point,
    curve: Curve,
    config?: SignatureConfig,
  ): PartialSignature {
  // function implementation
}

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
```

#### 5. Compute the signer response.
It will be use as the nonce.
- **Function:** `piSignature`
- **Location:** `src/signature/piSignature.ts`
- **Description:** Compute the signature from the actual signer.

**Code Snippet:**
```typescript
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
export function piSignature(
  alpha: bigint,
  c: bigint,
  signerPrivKey: bigint,
  curve: Curve,
): bigint
  // function implementation
}
```

#### 6. Compute the ring signature using the partial signature and the signer, and return the ring-signature.
- **Function:** `RingSignature.combine.ts`
- **Location:** `src/ringSignature.ts`
- **Description:** Compute the signature from the actual signer.

**Code Snippet:**
```typescript
/**
   * Combine partial signatures into a RingSignature
   *
   * @param partialSig - Partial signatures to combine
   * @param signerResponse - Response of the signer
   *
   * @returns A RingSignature
   */
  static combine(
    partialSig: PartialSignature,
    signerResponse: bigint,
  ): RingSignature {
  // function implementation
}
```
### RingSignature.verify
This method verifies if a ring signature is valid.

#### 1. Verify the ring signature
- **Function:** `RingSignature.verify.ts`
- **Location:** `src/ringSignature.ts`
- **Description:** Verify a RingSignature.

**Code Snippet:**
```typescript
 /**
   * Verify a RingSignature
   *
   * @remarks
   * if ring.length = 1, the signature is a schnorr signature. It can be verified by this method or using 'verifySchnorrSignature' function.
   * To do so, call 'verifySchnorrSignature' with the following parameters:
   * - messageDigest: the message digest
   * - signerPubKey: the public key of the signer
   * - signature: the signature { c, r } or { c, r, ring }
   * - curve: the curve used for the signature
   * - config: the config params used for the signature (can be undefined)
   * - keyPrefixing: true
   *
   * @returns True if the signature is valid, false otherwise
   */
  verify(): boolean {
 // function implementation
}
```
