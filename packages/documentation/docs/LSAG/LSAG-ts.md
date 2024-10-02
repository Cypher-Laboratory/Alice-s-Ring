---
id: LSAG-ts
title: LSAG-ts
--- 


# Alice's Ring LSAG-ts


The implementation is based on the LSAG algorithm as described in the [SAG paper](https://eprint.iacr.org/2004/027.pdf) and utilizes [Elliptic Curve Cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) (ECC) for key generation and message signing. We referred to the implementation proposed in [Zero to Monero](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) (p.36) as a guide.

## Getting Started

### Installation

Install the LSAG-ts library using npm or yarn:

```bash
npm install @cypher-laboratory/alicesring-lsag
```

```bash
yarn add @cypher-laboratory/alicesring-lsag
```

### Import Required Classes

```typescript
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';
```

### Initialize the Curve

Choose the elliptic curve that matches the keys you're using. Common choices are `SECP256K1` for Bitcoin/Ethereum keys or `ED25519`.

```typescript
const curve = new Curve(CurveName.SECP256K1);
```

### Create the Ring of Public Keys

Collect the public keys that will form the ring. Convert each public key into a `Point` object.

```typescript
// Example public keys in compressed hexadecimal format
// ex: 0x02 + x-coordinate (32 bytes) for SECP256K1
const publicKeys = [
  '030066ba293cc22d0eadbe494e9bd4d6d05c3e09d74dff0e991075de74b2359678',
  '0316d7da70ba247a6a40bb310187e8789b80c45fa6dc0061abb8ced49cbe7f887f',    '0221869ca3ae33be3a7327e9a0272203afa72c52a5460ceb9f4a50930531bd926a',
];

// Convert to Point objects
const ring: Point[] = publicKeys.map(compressed => Point.deserialize(compressed));
```
Or
```typescript
// Example public keys in hexadecimal format
const publicKeyHexes = [
  { x: 'x-coordinate-hex-1', y: 'y-coordinate-hex-1' },
  { x: 'x-coordinate-hex-2', y: 'y-coordinate-hex-2' },
  // ... other public keys
];

// Convert to Point objects
const ring: Point[] = publicKeyHexes.map(pk => new Point(
  curve,
  [BigInt('0x' + pk.x), BigInt('0x' + pk.y)]
));
```


### Prepare Your Private Key, Message, and Linkability Flag

The linkability flag is a string that provides context for the key image, preventing leakage of the global key image.
**Creating 2 signatures with the same linkability flag and privatekey will result in the same key image so any external observer can link the 2 signatures.** This is something you might want to avoid in some cases.

```typescript
const signerPrivateKey = BigInt('0x...'); // Your private key as a bigint
const message = 'Hello, Alice\'s Ring with LSAG!';
const linkabilityFlag = 'unique-context-string'; // Can be an empty string if not needed
```

### Sign the Message

```typescript
const signature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve,
  linkabilityFlag
);
```

### Verify the Signature

```typescript
const isValid = signature.verify();
console.log('Is the signature valid?', isValid); // Should output: true
```

### Serialize and Deserialize the Signature

**Serialize to JSON:**

```typescript
const jsonString = signature.toJsonString();
```

**Deserialize from JSON:**

```typescript
const importedSignature = RingSignature.fromJson(jsonString);
```

**Serialize to Base64:**

```typescript
const base64String = signature.toBase64();
```

**Deserialize from Base64:**

```typescript
const importedSignature = RingSignature.fromBase64(base64String);
```

## Usage Example

```typescript
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-lsag';

// Initialize curve
const curve = new Curve(CurveName.SECP256K1);

// Create ring
const ring: Point[] = [
  new Point(curve, [BigInt('0x1...'), BigInt('0x2...')]),
  new Point(curve, [BigInt('0x3...'), BigInt('0x4...')]),
  // ... add more public keys
];

// Your private key
const signerPrivateKey = BigInt('0x5...');

// Message to sign
const message = 'Confidential message with LSAG';

// Linkability flag (can be an empty string if not needed)
const linkabilityFlag = 'transaction-context';

// Sign the message
const signature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve,
  linkabilityFlag
);

// Verify the signature
if (signature.verify()) {
  console.log('Signature is valid.');
} else {
  console.log('Signature is invalid.');
}

// Serialize the signature
const signatureJson = signature.toJsonString();

// Deserialize and verify again
const importedSignature = RingSignature.fromJson(signatureJson);
console.log('Is the imported signature valid?', importedSignature.verify());
```

## Understanding the Key Classes

### `Point` Class

The `Point` class represents a point on an elliptic curve.

**Constructor:**

```typescript
const point = new Point(curve, [xCoordinate, yCoordinate]);
```

- **Parameters:**
  - `curve`: An instance of the `Curve` class.
  - `[xCoordinate, yCoordinate]`: The coordinates of the point as `bigint`s.

**Methods:**

- `mult(scalar: bigint): Point`: Multiplies the point by a scalar.
- `add(point: Point): Point`: Adds another point to the current point.
- `equals(point: Point): boolean`: Checks if two points are equal.
- `negate(): Point`: Returns the negation of the point.
- `serialize(): string`: Serializes the point to a compressed hex string.
- `static deserialize(compressed: string): Point`: Deserializes a point from a compressed hex string.
- `toEthAddress(): string`: Converts the point to an Ethereum address (only for `SECP256K1`).

**Example:**

```typescript
// Create a point
const point = new Point(curve, [BigInt('0x...'), BigInt('0x...')]);

// Multiply the point
const multipliedPoint = point.mult(BigInt(2));

// Serialize and deserialize
const serialized = point.serialize();
const deserializedPoint = Point.deserialize(serialized);
```

### `Curve` Class

The `Curve` class represents the elliptic curve.

**Constructor:**

```typescript
const curve = new Curve(CurveName.SECP256K1);
```

**Properties:**

- `name`: The name of the curve (`CurveName.SECP256K1` or `CurveName.ED25519`).
- `N`: The order of the curve.
- `G`: The generator point as `[x, y]`.
- `P`: The field size.

**Methods:**

- `GtoPoint(): Point`: Returns the generator point as a `Point` instance.
- `isOnCurve(point: Point | [bigint, bigint]): boolean`: Checks if a point is on the curve.

**Example:**

```typescript
const curve = new Curve(CurveName.SECP256K1);

// Get the generator point
const G = curve.GtoPoint();

// Check if a point is on the curve
const isValid = curve.isOnCurve(point);
```

### `RingSignature` Class

The `RingSignature` class handles the creation and verification of LSAG signatures.

**Methods:**

- `static sign(ring: Point[], signerPrivateKey: bigint, message: string, curve: Curve, linkabilityFlag: string): RingSignature`: Signs a message.
- `verify(): boolean`: Verifies the signature.
- `toJsonString(): string`: Serializes the signature to a JSON string.
- `static fromJson(json: string | object): RingSignature`: Deserializes a signature from JSON.
- `toBase64(): string`: Serializes the signature to a Base64 string.
- `static fromBase64(base64: string): RingSignature`: Deserializes a signature from Base64.
- `getKeyImage(): Point`: Retrieves the key image used in the signature.

**Example:**

```typescript
// Sign a message
const signature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve,
  linkabilityFlag
);

// Verify the signature
const isValid = signature.verify();

// Get the key image
const keyImage = signature.getKeyImage();

// Serialize and deserialize
const json = signature.toJsonString();
const signatureFromJson = RingSignature.fromJson(json);
```

## Detailed Implementation

### LSAG Signatures

LSAG signatures enhance traditional ring signatures by adding linkability. This allows observers to determine if two signatures were made by the same signer without revealing the signer's identity.

#### Key Image

The key image is a cryptographic construct that represents the signer's private key in a way that is unlinkable to the public key but can be used to detect if the same private key was used to sign multiple messages.

#### Linkability Flag

The linkability flag is an optional context string that, when used, binds the key image to a specific context to prevent leakage across different contexts.

### Signature Generation Steps

1. **Collect the Ring:**
   - Gather public keys and convert them to `Point` objects.
2. **Generate the Key Image:**
   - Compute a point derived from the signer's public key and the linkability flag.
   - Multiply this point by the signer's private key to obtain the key image.
3. **Generate Random Numbers:**
   - Generate random responses for non-signer indices in the ring.
4. **Compute Challenges and Responses:**
   - Calculate challenges (`c_i`) and responses (`r_i`) in a loop.
   - Ensure the signer's response satisfies the signature equation.
5. **Construct the Signature Object:**
   - Contains the ring, initial challenge, responses, message, curve, key image, linkability flag, and configuration.

### Signature Verification Steps

1. **Recompute Challenges:**
   - Starting from the initial challenge, recompute `c_i` values using the key image and linkability flag.
2. **Validate the Signature:**
   - If the recomputed initial challenge matches the original, the signature is valid.
   - Use the key image to check for repeated use of the same private key.

### Point Class

The `Point` class includes methods for point addition, scalar multiplication, serialization, deserialization, and validation.

**Key Methods:**

- `mult(scalar: bigint): Point`
- `add(point: Point): Point`
- `negate(): Point`
- `equals(point: Point): boolean`
- `serialize(): string`
- `static deserialize(compressed: string): Point`
- `checkLowOrder(): boolean`: Checks for low-order points (important for security).

### Curve Class

The `Curve` class encapsulates the properties of an elliptic curve.

**Key Properties:**

- `name`: Curve name.
- `N`: Order of the curve.
- `G`: Generator point.
- `P`: Field size.

**Key Methods:**

- `GtoPoint(): Point`
- `isOnCurve(point: Point | [bigint, bigint]): boolean`
- `equals(curve: Curve): boolean`

---

**Note:** For a complete explanation of SAG and LSAG differences and usages, refer to the [Ring Signatures](../ring-signatures) documentation.

## Security Considerations

- **Private Key Security:** Never expose your private key. Ensure it is securely stored and handled.
- **Random Number Generation:** The security of the signature relies on the randomness of the nonces generated. Use secure random number generators.
- **Ring Size:** A larger ring size enhances anonymity but may impact performance.
- **Key Image Uniqueness:** Reusing the same key image in different contexts can lead to linkability. Use the linkability flag appropriately.

## Sponsors

We would like to thank the XRPL Foundation ([https://xrpl.org/](https://xrpl.org/)) for their support and funding, which have allowed this library to be developed for the benefit of many.

## Audit

As of now, this library is has not been audited. Use it with caution in production environments. It is based on our SAG implementation, which has been audited.
Proceed with caution and consider auditing the code before using it in production.

## Contribution Guidelines

We welcome contributions to improve and extend the functionality of the LSAG-ts library. Feel free to open issues, suggest enhancements, or submit pull requests on our [GitHub repository](https://github.com/cypher-laboratory/alices-ring-lsag).

---

Feel free to explore the other implementations and tools in the Alice's Ring project:

- [SAG-ts](../SAG-ts): TypeScript implementation of Spontaneous Anonymous Group (SAG) signatures.
- [Metamask-snap](../metamask-snap): A Metamask snap to create and verify ring signatures easily.
- [SAG EVM Verifier](../SAG-evm-verifier): EVM verifier for SAG ring signature written in Solidity.
- [Rust Verifier](../SAG/SAG-rust-verifier): Rust verifier for SAG and LSAG ring signatures.

For further reading and a deeper understanding of the cryptographic principles involved, refer to the [Zero to Monero](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) document (p.36), which served as a reference for this implementation.

---

**Happy coding!** If you have any questions or need assistance, don't hesitate to reach out to the community.