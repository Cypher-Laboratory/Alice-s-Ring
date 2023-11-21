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

## Dev Dependecies

## Dev Dependencies

| Dev Dependency                      | Version  | Repository                                                                          |
|-------------------------------------|----------|-------------------------------------------------------------------------------------|
| @types/jest                         | ^29.5.7  | [GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jest) |
| @types/node                         | ^20.8.7  | [GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node) |
| @typescript-eslint/eslint-plugin    | ^5.61.0  | [GitHub](https://github.com/typescript-eslint/typescript-eslint)                   |
| @typescript-eslint/parser           | ^5.61.0  | [GitHub](https://github.com/typescript-eslint/typescript-eslint)                   |
| eslint                              | ^8.44.0  | [GitHub](https://github.com/eslint/eslint)                                         |
| jest                                | ^29.7.0  | [GitHub](https://github.com/facebook/jest)                                         |
| prettier                            | ^3.0.0   | [GitHub](https://github.com/prettier/prettier)                                     |
| ts-jest                             | ^29.1.1  | [GitHub](https://github.com/kulshekhar/ts-jest)                                    |
| ts-node                             | ^10.9.1  | [GitHub](https://github.com/TypeStrong/ts-node)                                    |