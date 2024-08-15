# Alice's-Ring-SAG-TS

This repository contains a TypeScript implementation of the [Ring Signature](https://en.wikipedia.org/wiki/Ring_signature) algorithm using Spontaneous Anonymous Group (SAG).

## About the implementation

The implementation is based on the SAG algorithm and uses the [Elliptic Curve Cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) (ECC) to generate the keys and sign the message.

We used the implementation proposed in [Zero to Monero](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) (p.36) as a reference.

## Audit

The audit of this library was conducted by the company CryptoExperts [https://www.cryptoexperts.com/](https://www.cryptoexperts.com/) on March 13th, 2024. All vulnerabilities identified in the course of the audit have been fixed in agreement and under the supervision of CryptoExperts.  

## Usage

```typescript
import { RingSignature , Curve , CurveName , Point } from '@cypher-laboratory/alicesring-sag';

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

| Dependency        | Version | repo                                    |audit report                                     |dependencies|
|-------------------|---------|-----------------------------------------|-------------------------------------------------|------------|
| @noble/hashes     | ^1.3.2  |[GitHub](https://github.com/paulmillr/noble-hashes)|[Report](https://cure53.de/pentest-report_hashing-libs.pdf)|[NPM](https://www.npmjs.com/package/@noble/hashes?activeTab=dependencies)|

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

## Spontaneous Anonymous Group (SAG) Signatures
### Group Setup
When setting up a group for cryptographic purposes, such as for a Spontaneous Anonymous Group (SAG) signature scheme, there are two primary methods to establish the group members' public keys: 

- **using existing public keys** of the members from publicly available data such as blockchains. This method is suitable for scenarios where the group members have a common caracteristics, such as being part of the same organization or having a specific role. For example, a group of members of a company's board of directors can be identified by their public keys, which are publicly available on the company's website.
- **using a group key generation algorithm** to generate the public keys of the members. This method is suitable for scenarios where the group members are not known in advance, such as in a voting system. For example, a group of voters can be identified by their public keys, which are generated by the voting system's key generation algorithm.

### Signature Generation
Let $l$ be the number of members in the group.  
Let $R$ be a set of public keys of the group members such as $R$ = { $K_{0}$ , $K_{1}$ , ..., $K_{n}$ } where n be the number of members in the group minus 1 ($l = n + 1$).   
Let $m$ be the digest of the message to be signed.   
Let $H$ be a hash function.   
Let $k$ be a random integer in the range $[1, N-1]$. This is the private key of the signer.  
Let $\pi$ be the signer position in the group. This is a random integer in the range $[0, n]$.  

The signer computes the following:
- Generates a random integer $\alpha$ in the range [1, N-1]
- Generates random responses *r* = { $r_{0}$ , $r_{1}$ , ... , $r_{\pi-1}$, $r_{\pi+1}$, ... , $r_{n}$ } where $r_{i}$ ($0 <= i <= n$ excluding $\pi$) is a random integer in the range $[1, N-1]$
- Computes $c_{\pi+1} = H(R, m, [\alpha G])$
- For $j$ in $[\pi + 1, l + \pi]$ computes the following:
    - $i = mod(j, l)$ -> allows to loop over the group members
    - $s = i - 1$ if $i > 0$ else $l - 1$ -> $s = i - 1$ except when $i = 0$. In this case, $s = l - 1$
    - $c_{i+1} = H(R, m, [r_{s}G + c_{s}K_{s}])$
- Define the signer's response to verify $\alpha = r_{\pi} + c_{\pi}k$ ($mod$ $N$)

The signature contains the following:
- the ring of public keys $R$
- the challenge $c_{1}$
- the responses $r$ = { $r_{0}$ , $r_{1}$ , ... , $r_{n}$ }
  

### Signature Verification
Known data:
- the ring of public keys $R$
- the seed $c_{0}$
- the responses $r$ = { $r_{0}$ , $r_{1}$ , ... , $r_{n}$ }
- the message $m$

The signature is valid if and only if the signature has been generated using one of the group member's private keys.

The verifier computes the following:
- For $i = 2$ to $n$, with $i$ wrapping around to 1 after $n$:
    - $c_{i}$' = $H( R, m, [ r_{i-1} G$  + $c_{i-1}$' $K_{i-1}$]) if $i ≠ 1$ else $c_{i}$' = $H(R, m, [r_{1}G + c_{1}K_{1}])$
- If $c_{1}$' = $c_{1}$ then the signature is valid, else it is invalid.


## Detailed implementation 

### RingSignature.sign

This method is designed to compute a ring signature by directly utilizing a private key as input. It's tailored for scenarios where you do not use a wallet for key management. The RingSignature.sign function needs the private key to generate the ring signature.

#### 1. Sort the ring by x ascending (and y ascending if x is equal)
Let $\pi$ be the signer position in the group. This is an integer in the range $[0, n]$.

#### 2. Generate Random Number $\alpha$
It will be use as the nonce.
- **Function:** `randomBigint`
- **Location:** `src/utils/randomNumber.ts`
- **Description:** Generates a random bigint in the range [1, max[.

```typescript
export function randomBigint(max: bigint): bigint
```

#### 3. Compute $c_{\pi+1}$
 $c_{\pi+1} = H(R, m, [\alpha G])$
- **Function:** `computeC`
- **Location:** `src/ringSignatures.ts`
- **Description:** Compute a c value.
- **Remarks:**
   * This function is used to compute the c value of a ring-signature.
   * Either 'alpha' or all the other keys of 'params' must be set..

```typescript
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
  ): bigint 
```
#### 4. Compute the challenges.
Generates random responses *r* = {$r_{1}$, ... , $r_{\pi-1}$, $r_{\pi+1}$, ... , $r_{n}$ } where $r_{i}$ ($0 <= i <= n$ excluding $\pi$) is a random integer in the range $[1, N-1]$  
For i = ${\pi+1}$, ${\pi+2}$ , ..., n, 1, 2, ..., ${\pi-1}$ calculate, replacing n + 1 → 1,

$c_{i+1} = H(R, m, [r_{s}G - c_{s}K_{s}])$

- **Function:** `RingSignature.signature`
- **Location:** `src/ringSignature.ts`
- **Description:** Generate an incomplete ring signature.

```typescript
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
  }
```

#### 5. Compute the signer response $r_{\pi}$
$r_{\pi}$ such that $\alpha = r_{\pi} - c_{\pi}k$ ($mod$ $N$).
- **Function:** `piSignature`
- **Location:** `src/signature/piSignature.ts`
- **Description:** Compute the signature from the actual signer.

```typescript
export function piSignature(
  alpha: bigint,
  c: bigint,
  signerPrivKey: bigint,
  curve: Curve,
): bigint 
```

#### 6. Return the ring signature
Return the ring-signature.
- **Function:** `constructor`
- **Location:** `src/ringSignature.ts`
- **Description:** Ring signature class constructor.

```typescript
  constructor(
    message: string,
    ring: Point[],
    c: bigint,
    responses: bigint[],
    curve: Curve,
    config?: SignatureConfig,
  ) 
```

### RingSignature.verify
This method verifies if a ring signature is valid.

#### 1. Verify the ring signature
- **Function:** `RingSignature.verify.ts`
- **Location:** `src/ringSignature.ts`
- **Description:** Verify a RingSignature.

```typescript
  verify(): boolean
```

## Sponsors

We would like to thank the XRPL Foundation [https://xrpl.org/](https://xrpl.org/) for their support and funding, which have allowed this audited library to be developed for the benefit of many.  
