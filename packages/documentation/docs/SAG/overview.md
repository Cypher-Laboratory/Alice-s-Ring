---
id: overview-sag
title: Overview
---
// todo




## Spontaneous Anonymous Group (SAG) Signatures

### Group Setup

When setting up a group for cryptographic purposes, such as for a Spontaneous Anonymous Group (SAG) signature scheme, there are two primary methods to establish the group members' public keys:

1. **Using Existing Public Keys:** Collect public keys from publicly available data, such as blockchains or public directories.
2. **Generating New Keys:** Use a key generation algorithm to generate new public/private key pairs for the group members.

### Signature Generation

The signer uses their private key and the ring of public keys to generate the signature. The process involves generating random numbers, computing challenges, and responses to ensure anonymity and unforgeability.

### Signature Verification

Anyone with the signature, message, and ring of public keys can verify the signature without knowing which member of the ring signed the message.

## Audit

The audit of this library was conducted by CryptoExperts ([https://www.cryptoexperts.com/](https://www.cryptoexperts.com/)) on March 13th, 2024. All vulnerabilities identified during the audit have been fixed under the supervision of CryptoExperts.

The audit report is available here: [Audit Report](https://github.com/Cypher-Laboratory/Alice-s-Ring/blob/main/packages/sag-ts/AUDIT_REPORT.pdf).
                                   |


## Getting Started

### Step 1: Obtain a List of Public Keys (the Ring)

The first step in using the SAG-ts library is to collect a list of public keys that will form the ring. This ring is a set of public keys, including your own public key and others, against which your signature will be indistinguishable.

**Sources of Public Keys:**

- **Blockchain Networks:** On public blockchains like Ethereum or Bitcoin, public keys (or addresses) are openly available. You can collect public keys from recent transactions or blocks.
- **Public Repositories:** If you're in a controlled environment, public keys may be available in a database or directory.
- **Generated Keys:** For testing purposes, you can generate a set of public/private key pairs.

**Important:** Ensure all public keys are valid and correspond to the same elliptic curve you're using.

### Step 2: Use the Library