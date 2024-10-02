

### Installation

Install the SAG-ts library using npm or yarn:

```bash
npm install @cypher-laboratory/alicesring-sag
```
```bash
yarn add @cypher-laboratory/alicesring-sag
```

### Import Required Classes

```typescript
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-sag';
```

### Initialize the Curve

Choose the elliptic curve that matches the keys you're using. Common choices are `SECP256K1` for Bitcoin/Ethereum keys or `ED25519`.

```typescript
const curve = new Curve(CurveName.SECP256K1);
```

### Create the Ring of Public Keys

Convert each public key into a `Point` object.

```typescript
// Example public keys in compressed hexadecimal format
// ex: 0x02 + x-coordinate (32 bytes) for SECP256K1
const publicKeys = [
  '030066ba293cc22d0eadbe494e9bd4d6d05c3e09d74dff0e991075de74b2359678',
  '0316d7da70ba247a6a40bb310187e8789b80c45fa6dc0061abb8ced49cbe7f887f',    '0221869ca3ae33be3a7327e9a0272203afa72c52a5460ceb9f4a50930531bd926a',
    // ... other public keys
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

### Prepare Your Private Key and Message

```typescript
const signerPrivateKey = BigInt('0x...'); // Your private key as a bigint
const message = `Hello, Alice's Ring!`;
```

### Sign the Message

```typescript
const signature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve
);
```

### Verify the Signature

```typescript
const isValid = signature.verify();
console.log('Is the signature valid?', isValid);
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
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-sag';

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
const message = 'Confidential message';

// Sign the message
const signature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve
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
  - `[xCoordinate, yCoordinate]`: The coordinates of the point as bigints.

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

The `RingSignature` class handles the creation and verification of ring signatures.

**Methods:**

- `static sign(ring: Point[], signerPrivateKey: bigint, message: string, curve: Curve): RingSignature`: Signs a message.
- `verify(): boolean`: Verifies the signature.
- `toJsonString(): string`: Serializes the signature to a JSON string.
- `static fromJson(json: string | object): RingSignature`: Deserializes a signature from JSON.
- `toBase64(): string`: Serializes the signature to a Base64 string.
- `static fromBase64(base64: string): RingSignature`: Deserializes a signature from Base64.

**Example:**

```typescript
// Sign a message
const signature = RingSignature.sign(ring, signerPrivateKey, message, curve);

// Verify the signature
const isValid = signature.verify();

// Serialize and deserialize
const json = signature.toJsonString();
const signatureFromJson = RingSignature.fromJson(json);
```


## Detailed Implementation

### Point Class

The `Point` class represents a point on an elliptic curve. It includes methods for point addition, scalar multiplication, serialization, deserialization, and validation.

**Constructor:**

```typescript
constructor(curve: Curve, coordinates: [bigint, bigint], safeMode = true)
```

- **Parameters:**
  - `curve`: An instance of the `Curve` class.
  - `coordinates`: A tuple `[x, y]` representing the point's coordinates.
  - `safeMode`: A boolean indicating whether to check if the point is on the curve.

**Key Methods:**

- `mult(scalar: bigint): Point`: Multiplies the point by a scalar.
- `add(point: Point): Point`: Adds another point to this point.
- `negate(): Point`: Negates the point.
- `equals(point: Point): boolean`: Checks if this point is equal to another.
- `serialize(): string`: Serializes the point to a compressed hex string.
- `static deserialize(compressed: string): Point`: Deserializes a point from a compressed hex string.
- `toEthAddress(): string`: Converts the point to an Ethereum address (for `SECP256K1` curve).
- `checkLowOrder(): boolean`: Checks if the point is of low order (relevant for `ED25519` curve).

### Curve Class

The `Curve` class encapsulates the properties of an elliptic curve.

**Constructor:**

```typescript
constructor(curve: CurveName)
```

- **Parameter:**
  - `curve`: The name of the curve (`CurveName.SECP256K1` or `CurveName.ED25519`).

**Key Properties:**

- `name`: The name of the curve.
- `N`: The order of the curve.
- `G`: The generator point `[x, y]`.
- `P`: The prime number defining the field.

**Key Methods:**

- `GtoPoint(): Point`: Returns the generator point as a `Point` instance.
- `isOnCurve(point: Point | [bigint, bigint]): boolean`: Checks if a point is on the curve.
- `equals(curve: Curve): boolean`: Checks if this curve is equal to another.

**Example:**

```typescript
const curve = new Curve(CurveName.SECP256K1);
const G = curve.GtoPoint();
```

---

**Note:** For a complete explanation of SAG and LSAG differences and usages, refer to the [Ring Signatures](../ring-signatures) documentation.

## Sponsors

We would like to thank the XRPL Foundation ([https://xrpl.org/](https://xrpl.org/)) for their support and funding, which have allowed this audited library to be developed for the benefit of many.



## Contribution Guidelines

We welcome contributions to improve and extend the functionality of the SAG-ts library. Feel free to open issues, suggest enhancements, or submit pull requests on our [GitHub repository](https://github.com/Cypher-Laboratory/Alice-s-Ring).

---

Feel free to explore the other implementations and tools in the Alice's Ring project:

- [LSAG Typescript](../LSAG/overview-lsag): TypeScript implementation of Linkable Spontaneous Anonymous Group (LSAG) signatures.
- [Metamask-snap](../metamask-snap/overview): A Metamask snap to create and verify ring signatures easily.
- [SAG EVM Verifier](./SAG-evm-verifier): EVM verifier for SAG ring signature written in Solidity.
- [Rust Verifier](../SAG/SAG-rust-verifier): Rust verifier for SAG and LSAG ring signatures.

For further reading and a deeper understanding of the cryptographic principles involved, refer to the [Zero to Monero](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) document (p.36), which served as a reference for this implementation.

---

**Happy coding!** If you have any questions or need assistance, don't hesitate to reach out to the community.