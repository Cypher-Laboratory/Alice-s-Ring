---
id: overview-sag
title: Overview
---
# SAG Overview

## Spontaneous Anonymous Group (SAG) Signatures

**Spontaneous Anonymous Group (SAG)** signatures are a type of ring signature that enables a member of a group (ring) to sign a message anonymously on behalf of the group. The signature assures verifiers that the signer is a legitimate member of the group, but it does not reveal which specific member signed the message. Unlike Linkable Spontaneous Anonymous Group (LSAG) signatures, SAG signatures do not provide linkability between multiple signatures made by the same signer; each signature is independent and cannot be linked to others.

**Key Properties:**

- **Anonymity:** The true signer remains concealed within the ring of public keys. Neither group members nor outsiders can ascertain the signer's identity.
- **Unlinkability:** Multiple signatures made by the same signer cannot be linked together. There is no way to determine if two signatures with the same ring were created by the same individual.

## How SAG Signatures Work

### Anonymity in Ring Signatures

Ring signatures are cryptographic mechanisms that allow a user to sign a message on behalf of a group without revealing their identity. The signature can be verified against a set of public keys (the ring), confirming that the signer possesses the private key corresponding to one of the public keys in the ring.

**Key Components:**

- **Ring of Public Keys:** A set of public keys from which the signer’s key is indistinguishable.
- **Signature Generation:** Involves creating a signature that proves knowledge of a private key corresponding to one of the ring's public keys without revealing which one.

## Use Cases for SAG Signatures

### Privacy-Preserving Communications

- **Anonymous Messaging:** Senders can communicate without revealing their identities.
- **Whistleblowing Platforms:** Individuals can disclose sensitive information without fear of retribution.

### Decentralized consensus

- **Consensus Mechanisms:** Participants can agree on outcomes without revealing their individual positions.

### Authentication Systems

- **Group Authentication:** Prove membership in a group without revealing individual identities.
- **Anonymous Credentials:** Users can demonstrate possession of certain rights or attributes anonymously.

### Blockchain and Cryptocurrencies

- **Privacy in Transactions:** Hide the origin of transactions by hiding them in a pool of public keys.
- **Ring Confidential Transactions:** Conceal transaction amounts and participants in cryptocurrencies.

## Creating SAG Signatures

### Collecting a List of Public Keys (Ring)

To create a SAG signature, the signer needs to collect a set of public keys, including their own and others'. This set forms the **ring** against which the signature will be verified.

**Sources of Public Keys:**

- **Blockchain Networks:**
  - Public keys are openly available on blockchains like Ethereum or Bitcoin.
  - Collect public keys from recent transactions or blocks.
- **Organizational Directories:**
  - Companies may have directories of employee or member public keys.
- **Public Repositories:**
  - Open-source projects may list contributors' public keys.

**Considerations:**

- **Validity:** Ensure all public keys are valid and correspond to the same elliptic curve.
- **Ring Size:** A larger ring increases anonymity but may impact performance.

### Steps to Create a SAG Signature

1. **Select the Elliptic Curve:**
   - Choose a curve compatible with the public keys.
   - Available choices are `SECP256K1` (used in Bitcoin, Ethereum, and many other blockchains) and `ED25519`.

2. **Collect Public Keys:**
   - Gather public keys to include in the ring.
   - Convert each public key to a `Point` object using your cryptographic library.

3. **Prepare Your Private Key and Message:**
   - Use your private key corresponding to your public key in the ring.
   - Prepare the message you wish to sign.

4. **Sign the Message:**
   - Use the SAG signing algorithm to create the signature.
   - The signature includes the ring, responses, and other parameters.

5. **Distribute the Signature:**
   - Share the signature with intended verifiers.
   - Ensure the ring is included so verifiers can validate the signature.

### Verifying a SAG Signature

Verifiers can confirm:

- **Authenticity:** The signature was created by someone in the ring.
- **Integrity:** The message has not been altered.
- **Anonymity:** The specific signer remains unknown.

**Verification Steps:**

1. **Obtain the Signature and Ring:**
   - Get the signature and the ring of public keys.

2. **Validate the Signature:**
   - Use the SAG verification algorithm with the provided parameters.

3. **Confirm Authenticity:**
   - Verify that the signature is valid for the message and the ring.

## Finding Public Keys for the Ring

### Blockchain Networks

- **Ethereum and Bitcoin:**
  - Public keys can be derived from addresses and transaction data.
  - Use blockchain explorers or APIs to retrieve public keys.

- **Monero:**
  - Monero uses stealth addresses, but for the purpose of forming a ring, decoy keys are selected from the blockchain.

### Public Directories and Repositories

- **PGP Key Servers:**
  - Public keys used for email encryption can be retrieved.

- **Git Repositories:**
  - Developers may have their public keys stored in repositories.

### Generating Public Keys

- **Test Environments:**
  - Generate key pairs using cryptographic libraries for testing purposes.

- **Controlled Systems:**
  - In private networks, keys can be distributed among participants.


## Security Considerations

### Private Key Security

- **Confidentiality:** Keep your private key secure. Exposure can compromise your anonymity.
- **Best Practices:** Use secure storage solutions and avoid transmitting the private key over insecure channels.
- **We built a [metamask snap plugin](../metamask-snap/overview.md) that allows you to sign messages with your private key without exposing it.** We encourage you to use it.


### Ring Composition

- **Valid Public Keys:** Ensure all public keys in the ring are valid and correspond to the same elliptic curve.
- **Ring Size:** Larger rings enhance anonymity but may increase computational overhead.

### Potential Attacks

- **Anonymity Set Reduction:** An attacker might try to reduce the effective anonymity set by including compromised or known keys in the ring or by analyzing multiple rings where the same key appears.
- 
---

If you have any questions or need further assistance with SAG signatures, feel free to reach out to the community or consult additional cryptographic resources.