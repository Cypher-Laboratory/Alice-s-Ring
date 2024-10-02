---
id: SAG-evm-verifier
title: "SAG: EVM verifier"
--- 

# SAG EVM Verifier

The SAG EVM Verifier is a Solidity implementation that allows you to verify Spontaneous Anonymous Group (SAG) signatures on the Ethereum Virtual Machine (EVM). These signatures are generated using [Alice's Ring](https://github.com/Cypher-Laboratory/Alice-s-Ring-SAG-TS), a TypeScript library for creating SAG signatures.


## How the Solidity Verifier Works

The Solidity verifier implements the verification process using elliptic curve cryptography over SECP256K1. To make your SAG signature verifiable on-chain, you need to generate it with `config.evmCompatibility` set to `true`. This setting ensures that the signature is generated using the `ecrecover` trick, making it verifiable on the EVM for much lower gas costs than traditional elliptic curve operations.

**Note:** The `ecrecover` trick allows us to perform a multiply-multiply-add operation for only 3,000 gas, compared to the 12,150 gas (2 * 6,000 + 150) required for using `ecMul` and `ecAdd` (see [EVM precompiled contracts](https://www.evm.codes/precompiled)). Since `ecrecover` returns an address (only the last 20 bytes of the hash result), each intermediary result during the generation is truncated to 20 bytes.

For more information on the `ecrecover` trick, refer to this [discussion](https://ethresear.ch/t/you-can-kinda-abuse-ecrecover-to-do-ecmul-in-secp256k1-today/2384/7).

## Generating a Ring Signature

Here's how to generate a ring signature using Alice's Ring in TypeScript:

```typescript
import { RingSignature, Curve, CurveName, Point } from '@cypher-laboratory/alicesring-sag';

const curve = new Curve(CurveName.SECP256K1);
const ring: Point[] = []; // Your ring of public keys
const message = 'Hello, Alice\'s Ring!';

const signerPrivateKey = BigInt('0x...'); // The signer's private key

// Sign
const signature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve,
  { evmCompatibility: true } // Important for EVM verification
);

// Verify locally
console.log('Is signature valid?', signature.verify()); // Should output: true

// Data to send on-chain
const onChainData = {
  ring: signature.getRing().map((publicKey: Point) => publicKey.serialize()), // Ring of public keys
  message: signature.messageDigest, // Message digest (BigInt)
  responses: signature.getResponses(), // Responses for each public key
  c: signature.getChallenge() // Signature challenge
};

console.log(onChainData);
```

**Important:** When generating the signature, set `evmCompatibility` to `true` in the configuration. This ensures that the signature is compatible with the EVM verifier.

>See the [SAG-Typescript documentation](../SAG/SAG-ts.md) for more details on generating SAG signatures using Typescript.

## Verifying a Ring Signature On-Chain

To verify the ring signature on-chain, you can use the SAG EVM Verifier contract. Below is an example of how to integrate the verifier into your Solidity contract.

### Installation

Add the SAG EVM Verifier to your project:

```bash
npm install @cypher-laboratory/sag-evm-verifier
```

### Importing the Verifier Interface

```solidity
pragma solidity ^0.8.24;

import { ISAGVerifier } from '@cypher-laboratory/sag-evm-verifier/contracts/ISAGVerifier.sol';

contract YourContract {
    ISAGVerifier sagVerifier;

    constructor(address sagVerifierAddress) {
        sagVerifier = ISAGVerifier(sagVerifierAddress);
    }

    function verifySignature(
        uint256 message,
        uint256[] memory ring,
        uint256[] memory responses,
        uint256 c
    ) public view returns (bool) {
        return sagVerifier.verifyRingSignature(message, ring, responses, c);
    }
}
```


### Gas Costs

To verify a SAG signature, the gas cost is approximately **6,500 per member** in the ring.

## Deployed Addresses

The SAG EVM Verifier is deployed on several networks:

| Network   |                                                                                                                 | Deployed Address                                                                                                                        |
|-----------|---------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Ethereum  | <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024" alt="Ethereum" width="30"/>                     | [`0xb9CcEe4d9CeFD1C10D4086E29a7889BBe05c2692`](https://etherscan.io/address/0xb9CcEe4d9CeFD1C10D4086E29a7889BBe05c2692#code)            |
| Polygon   | <img src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=024" alt="Polygon" width="30"/>                     | [`0xd199eA798750c1c0769062c098e6B811727cAa66`](https://polygonscan.com/address/0xd199eA798750c1c0769062c098e6B811727cAa66#code)         |
| Scroll    | <img src="https://scrollscan.com/assets/scroll/images/svg/logos/chain-light.svg?v=24.6.3.0" alt="Scroll" width="30"/> | [`0xc6174ef55415a6ed5be56550dd6b204fc1842f4c`](https://scrollscan.com/address/0xc6174ef55415a6ed5be56550dd6b204fc1842f4c#code)          |
| Optimism  | <img src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=024" alt="Optimism" width="30"/>             | [`0x5C862cC2406715Afa2104041076953386D22fFFF`](https://optimistic.etherscan.io/address/0x5C862cC2406715Afa2104041076953386D22fFFF#code) |
| Arbitrum  | <img src="https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=024" alt="Arbitrum" width="30"/>                     | [`0x5C862cC2406715Afa2104041076953386D22fFFF`](https://arbiscan.io/address/0x5C862cC2406715Afa2104041076953386D22fFFF#code)             |

## Understanding the Solidity Contract

Below is a breakdown of the key components of the SAG EVM Verifier contract.

### Explanation

- **verifyRingSignature:** Main function to verify the ring signature. It checks the validity of the ring and responses, then iteratively computes the challenges and verifies if the final computed challenge matches the initial one.
- **computeC and computeC1:** Helper functions to compute the challenge values (`c_i`). They use the `ecrecover` trick to perform elliptic curve operations efficiently.
- **sbmulAddSmul:** Performs the scalar multiplication and addition required for the verification using the `ecrecover` function.
- **isOnCurve:** Validates that a given point lies on the SECP256K1 curve.


## Contribution

We welcome contributions! To contribute, follow these steps:

1. **Fork the [Repository](https://github.com/Cypher-Laboratory/Alice-s-Ring):** Create a fork of the repository in your GitHub account.

2. **Create a New Branch:** Make a new branch for your feature or bug fix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Write Code:** Implement your feature or fix, ensuring your code is well-documented and tested.

4. **Submit a Pull Request:** Push your branch to your fork and open a pull request to the main repository.

---

## Additional Resources

- **Alice's Ring Library:** [GitHub Repository](https://github.com/Cypher-Laboratory/Alice-s-Ring)
- **Zero to Monero:** [PDF Document](https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf) (p.36)

---

**Happy coding!** If you have any questions or need assistance, don't hesitate to reach out to the community.