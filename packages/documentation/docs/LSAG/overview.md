---
id: overview-lsag
title: Overview
---

# LSAG Overview

## Linkable Spontaneous Anonymous Group (LSAG) Signatures

**Linkable Spontaneous Anonymous Group (LSAG)** signatures are an advanced form of ring signatures that provide both anonymity and linkability. They allow a member of a group (ring) to sign a message anonymously on behalf of the group, ensuring that the verifier cannot determine which specific member signed the message. Additionally, LSAG signatures enable the detection of multiple signatures created by the same signer, which is crucial for preventing double-spending in cryptocurrencies and detecting misuse in anonymous systems.

**Key Properties:**
- **Anonymity:** The actual signer remains hidden within the ring of public keys. No one from nor outside the ring can determine the signer's identity.
- **Linkability:** If the same private key signs multiple messages using the same linkability flag, the signatures can be linked together using a unique identifier called the **key image**.

## How LSAG Signatures Work

### Anonymity in Ring Signatures

Ring signatures are cryptographic constructs that allow a signer to produce a signature that proves membership in a group without revealing their identity. The signature can be verified against a set of public keys (the ring), confirming that the signer possesses the private key corresponding to one of the public keys.


### Linkability in LSAG

LSAG signatures introduce the concept of **linkability** while maintaining anonymity. This means that although the signer remains anonymous within the ring, if they sign multiple messages, those signatures can be linked together.

**Key Components:**

- **Key Image:** A cryptographic representation of the signer's private key that is unique and remains the same across multiple signatures using the same linkability flag
- **Linkability Flag:** An optional parameter that provides context to the key image, allowing the signer to control the scope of linkability.

### Purpose of the Key Image

The **key image** is a point on the elliptic curve derived from the signer's private key. It serves as a unique identifier for that private key in a given context.

**Properties:**

- **Uniqueness:** Each private key + linkability flag couple corresponds to a unique key image.
- **Anonymity Preservation:** The key image does not reveal the signer's identity or their private key.
- **Linkability:** If the same private key is used to sign multiple messages, the key image remains the same, allowing verifiers to link those signatures.

### Purpose of the Linkability Flag

The **linkability flag** is an optional string that provides additional context to the key image computation.

**Implications:**

- **Contextual Linkability:** By incorporating the linkability flag, the key image becomes unique to both the private key and the context defined by the flag.
- **Controlled Linkability:** The signer can choose when their signatures are linkable by varying the linkability flag.
- **Preventing Cross-Context Linkage:** Using different flags in different contexts ensures that signatures cannot be linked across those contexts.

## Use Cases for LSAG Signatures

### Cryptocurrencies (e.g., Monero)

- **Privacy:** Hide the sender's identity in transactions.
- **Double-Spend Prevention:** The key image ensures that the same output cannot be spent twice.
- **Linkability:** Detect if a private key is used more than once without revealing which key it is.

### Anonymous Authentication Systems

- **Access Control:** Verify that a user is part of an authorized group without revealing their identity.
- **Usage Tracking:** Detect if the same user accesses the system multiple times when only single access is permitted.

### Voting Systems

- **Anonymity:** Voters can cast their votes without revealing their identity.
- **One Vote Per Person:** Use key images to ensure each voter only votes once.

### Credential Systems

- **Anonymous Credentials:** Users can prove they possess certain attributes or rights without revealing their identity.
- **Misuse Detection:** Link multiple uses of the same credential when misuse is suspected.

## Creating LSAG Signatures

### Collecting a List of Public Keys (Ring)

To create an LSAG signature, the signer needs to collect a set of public keys, including their own and others'. This set forms the **ring** against which the signature will be verified.

**Considerations:**

- **Validity:** Ensure all public keys are valid and correspond to the same elliptic curve.
- **Ring Size:** A larger ring increases anonymity but may affect performance.

### Steps to Create an LSAG Signature

1. **Select the Elliptic Curve:**
   - Choose a curve compatible with the public keys.
   - Common choices are `SECP256K1` (used in Bitcoin, Ethereum and most of the blockchains) and `ED25519`.

2. **Collect Public Keys:**
   - Gather public keys to include in the ring.
   - Convert each public key to a `Point` object in your cryptographic library.

3. **Prepare Your Private Key and Message:**
   - Use your private key corresponding to your public key in the ring.
   - Prepare the message you wish to sign.

4. **Decide on a Linkability Flag:**
   - Choose a string that defines the context for linkability.
   - An empty string means global linkability (signatures can be linked across all contexts).
   - A unique string per context ensures signatures are only linkable within that context.
   - The linkability flag can be whatever you want, such as a transaction ID or a timestamp but it could also be an empty string (this will publish the user's global key image and it is not recommended).

5. **Sign the Message:**
   - Use the LSAG signing algorithm to create the signature.
   - The signature includes the ring, responses, key image, and other parameters.

6. **Distribute the Signature:**
   - Share the signature with intended verifiers.
   - Ensure the ring is included so verifiers can validate the signature.

### Verifying an LSAG Signature

Verifiers can confirm:

- **Authenticity:** The signature was created by someone in the ring.
- **Integrity:** The message has not been altered.
- **Linkability:** If the key image matches one from another signature, they can link the signatures.

**Verification Steps:**

1. **Obtain the Signature and Ring:**
   - Get the signature and the ring of public keys.

2. **Validate the Signature:**
   - Use the LSAG verification algorithm with the provided key image and linkability flag.

3. **Check for Linkage:**
   - Compare the key image with those from other signatures.
   - If the key images match, the signatures are linked (from the same private key).

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
- **Best Practices:** Use secure storage and avoid transmitting the private key.
- **We built a [metamask snap plugin](../metamask-snap/overview.md) that allows you to sign messages with your private key without exposing it.** We encourage you to use it.

### Key Image Privacy

- **Contextual Usage:** Be mindful of the linkability flag to prevent unintended linkage.
- **Avoid Reuse:** Use different linkability flags in different contexts if cross-context linkability is not desired.

### Ring Composition

- **Valid Public Keys:** Ensure all public keys in the ring are valid and on the same curve.
- **Ring Size:** Larger rings provide better anonymity but may increase computational overhead.


---

If you have any questions or need further assistance with LSAG signatures, feel free to reach out to the community or consult additional cryptographic resources.