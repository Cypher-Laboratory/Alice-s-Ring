# SAG Verifier for EVM

## Overview

This Solidity-based SAG Verifier allows you to verify spontaneous anonymous group (SAG) signatures on the Ethereum Virtual Machine (EVM). These signatures are generated using [Alice's Ring](https://github.com/Cypher-Laboratory/Alice-s-Ring-SAG-TS), a TypeScript library for creating SAG signatures.

## What Are Ring Signatures?

Ring signatures allow a member of a group to sign a message on behalf of the entire group while keeping the individual signer’s identity hidden. This guarantees the signer’s anonymity within the group. These signatures are termed 'spontaneous' because the signer does not need authorization from other group members to sign a message. 
For a quick mathematical explanation, you can refer to [this link](https://github.com/Cypher-Laboratory/Alice-s-Ring-SAG-TS?tab=readme-ov-file#spontaneous-anonymous-group-sag-signatures).

> **Note**: Our SAG Verifier implementation currently supports ECC over SECP256K1, the most widely used curve in blockchains. Support for ED25519 will be added soon.

### Use Cases

- **Private Login**: Authenticate users without revealing their identity.
- **Solvency Proofs**: Prove possession of funds or assets without disclosing the exact amount or owner.
- **Secret Leakage**: Share confidential information without revealing the source but assert its authenticity.

## How the Solidity Verifier Works

The Solidity verifier implements the verification process using elliptic curve cryptography over SECP256K1. If you want your SAG Signature to be verifiable on-chain, you need to generate it with `config.evmCompatibility` set to `true`. This setting ensures that the signature is generated using the `ecrecover` trick, making it verifiable on the EVM for much lower gas costs than traditional elliptic curve operations.

**Note**: The `ecrecover` trick allows us to perform a multiply-multiply-add operation for only 3000 gas, compared to the 12150 gas (2*6000 + 150) required for using `ecMul` and `ecAdd` (see [EVM precompiled contracts](https://www.evm.codes/precompiled)). Since `ecrecover` returns an address (only the first 20 bytes of the hash result), each intermediary result during the generation is truncated to 20 bytes.

For more information on the `ecrecover` trick, you can refer to this [discussion](https://ethresear.ch/t/you-can-kinda-abuse-ecrecover-to-do-ecmul-in-secp256k1-today/2384/7).


### Generating a Ring Signature

Here's a TypeScript snippet to generate a ring signature using Alice's Ring:

```typescript
import { RingSignature, Curve, CurveName, Point } from "@cypher-laboratory/alicesring-sag"

const curve: Curve = new Curve(CurveName.SECP256K1);
const ring: Point[] = []; // your ring of public keys 
const message = 'Hello World!';

const signerPrivateKey = BigInt('The signer private key');

// Sign
const signature: RingSignature = RingSignature.sign(
  ring,
  signerPrivateKey,
  message,
  curve,
  { evmCompatibility: true, }
);

// Verify
console.log(
  "Is signature valid? ", signature.verify()
);

// data to send onChain:
console.log({
  ring: signature.getRing().map((publicKey: Point) => publicKey.serialize()), // ring of public keys
  message: signature.messageDigest, // message digest
  responses: signature.getResponses(), // response for each public key
  c: signature.getChallenge() // signature challenge
})
```

### Verify a Ring Signature onChain


To call the verifier from another Solidity contract:

```solidity
pragma solidity ^0.8.24;

import {ISAGVerifier} from "@cypher-laboratory/sag-evm-verifier/contracts/ISAGVerifier.sol";

contract DummyContract {
    ISAGVerifier sagVerifier;

    constructor(address _sagVerifier_Address) {
        sagVerifier = ISAGVerifier(_sagVerifier_Address);
    }

    function dummyFunction(
        uint256 message,
        uint256[] memory ring,
        uint256[] memory responses,
        uint256 c
    ) public view returns (string memory) {
        if (sagVerifier.verifyRingSignature(message, ring, responses, c)) {
            return "Signature is verified";
        } else {
            return "Signature is not verified";
        }
    }
}
```
### Gas Costs

To verify a SAG signature, the gas cost is approximately 6500 per member in the ring.

## Deployed addresses:
| Network  |                                                                                                                       | Deployed Address                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum | <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024" alt="Ethereum" width="30"/>                       | [`0xb9CcEe4d9CeFD1C10D4086E29a7889BBe05c2692`](https://etherscan.io/address/0xb9CcEe4d9CeFD1C10D4086E29a7889BBe05c2692#code)            |
| Polygon  | <img src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=024" alt="Polygon" width="30"/>                       | [`0xd199eA798750c1c0769062c098e6B811727cAa66`](https://polygonscan.com/address/0xd199eA798750c1c0769062c098e6B811727cAa66#code)         |
| Scroll   | <img src="https://scrollscan.com/assets/scroll/images/svg/logos/chain-light.svg?v=24.6.3.0" alt="Scroll" width="30"/> | [`0xc6174ef55415a6ed5be56550dd6b204fc1842f4c`](https://scrollscan.com/address/0xc6174ef55415a6ed5be56550dd6b204fc1842f4c#code)          |
| Optimism | <img src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=024" alt="Optimism" width="30"/>               | [`0x5C862cC2406715Afa2104041076953386D22fFFF`](https://optimistic.etherscan.io/address/0x5C862cC2406715Afa2104041076953386D22fFFF#code) |
| Arbitrum | <img src="https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=024" alt="Arbitrum" width="30"/>                       | [`0x5C862cC2406715Afa2104041076953386D22fFFF`](https://arbiscan.io/address/0x5C862cC2406715Afa2104041076953386D22fFFF#code)             |

## Contribution

We welcome contributions! To contribute, follow these steps:

1. Fork the repository and create a new branch.
2. Write well-commented and tested code.
3. Submit a pull request.

---