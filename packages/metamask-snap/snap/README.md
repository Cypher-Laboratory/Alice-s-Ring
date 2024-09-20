# Metamask Snap for SAG and LSAG signatures

## Overview

This snap utilizes our ring signature implementation to privately sign messages. The signature can then be verified by any third party without revealing the actual signer.

It supports two types of ring signatures: [Spontaneous Anonymous Group signatures (SAG)](https://github.com/Cypher-Laboratory/Alice-s-Ring-SAG-TS) and [Linkable Spontaneous Anonymous Group signatures (LSAG)](https://github.com/Cypher-Laboratory/Alice-s-Ring-LSAG-TS). If you are using the SAG scheme, no one will ever know that you signed the message. Use the LSAG scheme if you want third parties to know you signed multiple messages without revealing your identity.

## Features

- Create an ethereum account
- Import an ethereum account using a mnemonic
- export the snap addresses
- sign a message using SAG and LSAG with the snap
- Verify a SAG or LSAG signature

## What are Ring Signatures

Ring signatures are a type of digital signature that allows a group of users to sign a message anonymously. Unlike traditional digital signatures uniquely linked to one user, ring signatures obscure the actual author by linking multiple possible signers together in a "ring."

Ring signatures preserve privacy and anonymity by obscuring the specific originator of a message. By grouping possible signers in a "ring," there is no way to definitively pinpoint the actual individual who authored the content. This prevents transactions from being easily traced back to a single user. The larger the ring of possible signers, the more anonymity is provided to the real originator.

Ring signatures have been known to cryptographers for several years, but their use within the blockchain ecosystem has been limited. The Monero blockchain is noted as one of the first to employ this cryptographic solution at the protocol level. However, there is currently no complete, robust, and audited implementation of ring signatures adapted for the browser environment. This is where we come in!

More about ring signatures [here](https://people.csail.mit.edu/rivest/pubs/RST01.pdf).

## Installation & usage

For an easy use of this snap, please refer to the toolkit we created [here](https://github.com/Cypher-Laboratory/Alice-s-Ring-snap-toolkit).
It can be installed from npmjs: <br>
`npm i @cypher-laboratory/alicesring-snap-sdk` <br>
or<br>
`yarn add @cypher-laboratory/alicesring-snap-sdk`

## FAQ

Here are some main questions that could be included in an FAQ about the MetaMask Snap called Ring Signatures:

1. **What is the Ring Signatures MetaMask Snap?**

   - The Ring Signatures MetaMask Snap is an add-on for MetaMask that allows users to import Ethereum accounts and privately sign messages using the Cypher Lab SAG and LSAG schemes.

2. **What are ring signatures?**
   - Ring signatures are a type of digital signature that can be performed by any member of a group of users that each have keys. It ensures that a message is signed without revealing which group member signed it.

### Usage Questions

3. **How do I import my Ethereum account into the Ring Signatures Snap?**

   - Any website can ask the user to import an account into the Snap. The user will then need to write their mnemonic directly into the Snap interface, only if they choose to do so. **You would never have to paste your mnemonic outside the Snap interface. If someone asks you to do it outside the Snap, this might be a scam. Be aware.**

4. **How do I sign a message using the Ring Signatures Snap?**

   - Any website can ask the user to sign a message using ring signatures. Once requested, the MetaMask interface will prompt the user for approval to sign the message. The message is signed only if the user approves the request.

5. **What is the difference between the SAG and LSAG schemes?**
   - Both SAG and LSAG provide anonymity and spontaneity, ensuring the signer remains anonymous within a group without requiring a trusted setup; however, SAG is non-linkable, focusing solely on privacy, while LSAG introduces linkability to detect repeated uses of the same couple (private key, linkability flag), enhancing security against double-spending and other fraudulent activities.

### Privacy and Security Questions

6. **How does the Ring Signatures Snap ensure my privacy?**

   - The Snap uses advanced cryptographic techniques provided by the SAG and LSAG schemes to sign messages without revealing the identity of the signer, ensuring privacy.

7. **Is my private key safe when using the Ring Signatures Snap?**

   - Yes, the Snap is designed to securely handle your private keys within the MetaMask environment, ensuring they are not exposed or compromised. Both libraries use the same [audited](https://github.com/Cypher-Laboratory/Alice-s-Ring-SAG-TS/blob/main/AUDIT_REPORT.pdf) base.

8. **Can anyone in the ring sign messages on my behalf?**
   - The signatures are 'Spontaneous,' meaning anyone can use any public keys to build a signature. If someone uses your public key to build a signature, it might appear to a third party that you are the signer. Similarly, you can use any public key in your signatures, making it seem like any other group member might have signed your message.

### Technical Questions

9. **What are the Cypher Lab SAG and LSAG schemes?**

   - The Cypher Lab SAG and LSAG libraries are implementations of advanced cryptographic protocols designed to enhance security and privacy. They are part of Alice's Ring, a set of open-source cryptographic tools developed by Cypher Lab, created to provide secure and privacy-enhancing functionalities for various applications.

10. **Where can I find the source code for the Ring Signatures Snap?**
    - The source code for the Snap is fully open source and available on [this repository](https://github.com/Cypher-Laboratory/Alice-s-Ring-snap/tree/main/packages/snap).

### Troubleshooting Questions

11. **What should I do if I encounter an error while using the Snap?**

    - You can refer to the troubleshooting section of the Snap’s documentation or seek help from the community on the project's GitHub page or support forums. A discord channel is dedicated for the snap support [here](https://discord.gg/jUEkpw5zyH).

12. **How can I report a bug or suggest a feature for the Ring Signatures Snap?**
    - You can report bugs or suggest features by [opening an issue](https://github.com/Cypher-Laboratory/Alice-s-Ring-snap/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=) on the Snap’s GitHub repository.

### Additional Questions

13. **Can I use the Ring Signatures Snap with other blockchain networks?**

    - Currently, the Snap is designed to create signatures over SECP256K1 (the most widely used curve in the blockchain ecosystem). The SAG signatures are already verifiable onChain. [See this](https://github.com/Cypher-Laboratory/evm-verifier?tab=readme-ov-file#deployment-addresses). LSAG will be supported in the next months.

14. **Is there a limit to the number of accounts I can import into the Snap?**
    - There is no specific limit, but performance may vary depending on the number of accounts and the capabilities of your device.
