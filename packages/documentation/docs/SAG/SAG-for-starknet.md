---
id: SAG-starknet
title: "SAG for Starknet"
---

# SAG for Starknet

The **SAG for Starknet** implementation enables verification of Spontaneous Anonymous Group (SAG) signatures on the Starknet blockchain. This implementation leverages Starknet-specific optimizations to perform ring signature verification efficiently on-chain, supporting both SECP256K1 and ED25519 elliptic curves.

The SAG verification functionality on Starknet is provided by the `starknet-sag-ts` package from [Alice's Ring](https://github.com/Cypher-Laboratory/Alice-s-Ring-SAG-TS), a TypeScript library for creating SAG signatures.

## Key Differences in the Starknet Implementation

The Starknet version of the SAG verifier shares the same fundamental logic as the EVM version, with a few important adjustments to optimize for the Starknet ecosystem:

1. **Poseidon Hash Function**: The signer and verifier use the Poseidon hashing function, which is computationally cheaper on Starknet compared to traditional hashing algorithms.

2. **Garaga for Multi-Scalar Multiplication (MSM)**: The implementation is using Garaga allowing efficient on-chain multi-scalar multiplication (MSM). The process incorporates hints passed alongside the ring signature to perform MSM efficiently.

## Generating a Ring Signature for Starknet

Here's how to generate a ring signature for starknet using Alice's Ring in TypeScript:

```typescript
import {
  RingSignature,
  Curve,
  CurveName,
  Point,
} from "@cypher-laboratory/alicesring-sag-starknet";

const curve = new Curve(CurveName.SECP256K1);
const ring: Point[] = []; // Your ring of public keys
const message = "Hello, Alice's Ring!";

const signerPrivateKey = BigInt("0x..."); // The signer's private key

// Sign
const signature = RingSignature.sign(ring, signerPrivateKey, message, curve);

// Verify locally
console.log("Is signature valid?", signature.verify()); // Should output: true

(async () => {
  // Get the signature data to send to the contract
  const signature = RingSignature.sign(ring, signerPrivateKey, message, curve);
  const rawCallData = await signature.getCallData();
  console.log(rawCallData);
})();
```

**Important:** ringSignature.getCallData() is an **async** function.

## Verifying a Ring Signature On-Chain

To verify the ring signature on-chain, you can use the [SAG verifier in Cairo](https://github.com/Cypher-Laboratory/Alice-s-Ring-Cairo-verifier).
Below is an example of how to integrate the verifier into your Cairo contract.

### Installation

Add the SAG Cairo Verifier to your **Scarb.toml**:

```toml
[dependencies]
alices_ring_cairo_verifier = {git = "https://github.com/Cypher-Laboratory/Alice-s-Ring-Cairo-verifier.git"}
```

### Importing the Verifier Interface

```cairo
use alices_ring_cairo_verifier::structtype::ringsignature;

#[starknet::interface]
pub trait IRingSignatureVerifier<TContractState> {
    fn verify_rs(self: @TContractState, ring_signature: RingSignature) -> bool;
}

#[starknet::contract]
mod RingSignatureVerifier {
    use alices_ring_cairo_verifier::verify;
    use alices_ring_cairo_verifier::structType::RingSignature;

    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl IRingSignatureVerifier of super::IRingSignatureVerifier<ContractState> {
        fn verify_rs(self: @ContractState, ring_signature: RingSignature) -> bool {
            verify(ring_signature)
        }
    }
}
```

### Using Voyager block explorer :

You can also pass the raw call data to the deployed contract at the following address:

**Starknet Contract Address**: [`0x0317Ce745DE0A65308A19f6e184Be43A17F20D1eAe04B7433d984Df1D571DAA4`](https://sepolia.voyager.online/contract/0x0317Ce745DE0A65308A19f6e184Be43A17F20D1eAe04B7433d984Df1D571DAA4#readContract) on Sepolia Starknet.

### Number of steps

Verifying a SAG signature requires approximately 46,800 steps per member in the ring.

## Deployed address

| Network          |                                                                                                        | Deployed Address                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Starknet-Sepolia | <img src="https://cryptologos.cc/logos/starknet-token-strk-logo.png?v=035" alt="Starknet" width="30"/> | [`0x0317Ce745DE0A65308A19f6e184Be43A17F20D1eAe04B7433d984Df1D571DAA4`](https://sepolia.voyager.online/contract/0x0317Ce745DE0A65308A19f6e184Be43A17F20D1eAe04B7433d984Df1D571DAA4) |

## Contribution

We welcome contributions! To contribute, follow these steps:

1. Fork the [Repository for the signer](https://github.com/Cypher-Laboratory/Alice-s-Ring)
   or the [Repository for the verifier](https://github.com/Cypher-Laboratory/Alice-s-Ring-Cairo-verifier) : Create a fork of the repository in your GitHub account.
2. **Create a New Branch:** Make a new branch for your feature or bug fix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Write Code:** Implement your feature or fix, ensuring your code is well-documented and tested.

4. **Submit a Pull Request:** Push your branch to your fork and open a pull request to the main repository.

---

## Additional Resources

- **Alice's Ring Library:** [GitHub Repository](https://github.com/Cypher-Laboratory/Alice-s-Ring)
- **Garaga:** [Documentation](https://garaga.gitbook.io/garaga)
- **Zero to Monero:** [PDF Document](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) (p.36)

---

