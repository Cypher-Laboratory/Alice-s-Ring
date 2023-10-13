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