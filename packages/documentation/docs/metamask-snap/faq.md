---
id: faq
title: FAQ
sidebar_position: 5
---

### Usage Questions

#### How do I import my Ethereum account into the Ring Signatures Snap?
   Any website can ask the user to import an account into the Snap. The user will then need to write their mnemonic directly into the Snap interface, only if they choose to do so. **You would never have to paste your mnemonic outside the Snap interface. If someone asks you to do it outside the Snap, this might be a scam. Be aware.**

#### How do I sign a message using the Ring Signatures Snap?
   Any website can ask the user to sign a message using ring signatures. Once requested, the MetaMask interface will prompt the user for approval to sign the message. The message is signed only if the user approves the request.

#### What is the difference between the SAG and LSAG schemes?
   Both SAG and LSAG provide anonymity and spontaneity, ensuring the signer remains anonymous within a group without requiring a trusted setup; however, SAG is non-linkable, focusing solely on privacy, while LSAG introduces linkability to detect repeated uses of the same couple (private key, linkability flag), enhancing security against double-spending and other fraudulent activities.

### Privacy and Security Questions

#### How does the Ring Signatures Snap ensure my privacy?
   The Snap uses advanced cryptographic techniques provided by the SAG and LSAG schemes to sign messages without revealing the identity of the signer, ensuring privacy.

#### Is my private key safe when using the Ring Signatures Snap?
   Yes, the Snap is designed to securely handle your private keys within the MetaMask environment, ensuring they are not exposed or compromised. Both libraries use the same [audited](https://github.com/Cypher-Laboratory/Alice-s-Ring/blob/main/AUDIT_REPORT.pdf) base.

#### Can anyone in the ring sign messages on my behalf?
   The signatures are 'Spontaneous,' meaning anyone can use any public keys to build a signature. If someone uses your public key to build a signature, it might appear to a third party that you are the signer. Similarly, you can use any public key in your signatures, making it seem like any other group member might have signed your message.

### Technical Questions

#### What are the Cypher Lab SAG and LSAG schemes?
   The Cypher Lab SAG and LSAG libraries are implementations of advanced cryptographic protocols designed to enhance security and privacy. They are part of Alice's Ring, a set of open-source cryptographic tools developed by Cypher Lab, created to provide secure and privacy-enhancing functionalities for various applications.

#### Where can I find the source code for the Ring Signatures Snap?
    The source code for the Snap is fully open source and available on [this repository](https://github.com/Cypher-Laboratory/Alice-s-Ring-snap/tree/main/packages/snap).

### Troubleshooting Questions

#### What should I do if I encounter an error while using the Snap?
    You can refer to the troubleshooting section of the Snap’s documentation or seek help from the community on the project's GitHub page or support forums. A discord channel is dedicated for the snap support [here](https://discord.gg/jUEkpw5zyH).

#### How can I report a bug or suggest a feature for the Ring Signatures Snap?
    You can report bugs or suggest features by [opening an issue](https://github.com/Cypher-Laboratory/Alice-s-Ring-snap/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=) on the Snap’s GitHub repository.

### Additional Questions

#### Can I use the Ring Signatures Snap with other blockchain networks?
    Currently, the Snap is designed to create signatures over SECP256K1 (the most widely used curve in the blockchain ecosystem). The SAG signatures are already verifiable onChain. [See this](https://github.com/Cypher-Laboratory/evm-verifier?tab=readme-ov-file#deployment-addresses). LSAG will be supported in the next months.

#### Is there a limit to the number of accounts I can import into the Snap?
    There is no specific limit, but performance may vary depending on the number of accounts and the capabilities of your device.
