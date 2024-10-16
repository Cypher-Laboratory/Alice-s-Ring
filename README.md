# Alice's Ring Monorepo

Welcome to **Alice's Ring**, an open-source, community-driven initiative aimed at enhancing privacy in the Web3 ecosystem through the use of **Ring Signatures**. Our goal is to make privacy a core aspect of digital interactions, empowering developers to seamlessly integrate ring signature-based privacy features into decentralized applications.  

## 💍 What is Alice's Ring?

**Alice’s Ring** is a suite of cryptographic tools designed to empower developers to integrate privacy into blockchain applications using **Ring Signatures**. By supporting multiple languages and platforms, Alice’s Ring provides flexible, cross-environment solutions—from front-end **TypeScript** libraries to **on-chain verifications in Solidity**, and high-performance implementations in **Rust**.


Our mission is to shape a future where privacy is embedded in every layer of the Web3 experience, offering users secure and anonymous solutions.  


### What Alice's Ring Offers

- **TypeScript**: Libraries for front-end development, enabling privacy-preserving interactions with decentralized applications.
- **Rust**: High-performance library for ring signature verification, ideal for privacy-preserving applications requiring enhanced security.
- **Solidity**: On-chain verification tools for Ethereum, bringing privacy features directly to smart contracts.
- **Cairo**: Tools for StarkNet, allowing developers to use ring signatures in Ethereum's Layer-2 solutions.

## 🖋️ Intro to Ring Signatures

**Ring Signatures** are cryptographic protocols that enable a group of users to sign a message while preserving the anonymity of the actual signer. Unlike traditional digital signatures, ring signatures introduce signer ambiguity, making it unclear which member of the group produced the signature. This ensures that the message could plausibly have been signed by any participant, making it extremely difficult to trace the true author.

Ring signatures enhance privacy by making transactions untraceable. They are widely used in applications such as blockchain-based privacy coins (e.g., Monero) and secure voting systems, where anonymity and security are paramount.  

### **Spontaneous Anonymous Group (SAG) Signatures**
SAG signatures allow spontaneous group formation, ensuring anonymity without requiring setup among members.

### **Linkable Spontaneous Anonymous Group (LSAG) Signatures**
LSAG adds linkability to SAG, making it useful for blockchain environments to prevent double-spending while maintaining privacy.

## 📦 Contents of the Monorepo
The Alice's Ring monorepo includes several projects, each focusing on different implementations and integrations of ring signature schemes:

1. **[SAG-ts](./packages/sag-ts)**: Audited TypeScript implementation of Spontaneous Anonymous Group (SAG) signatures. Useful for front-end developers integrating SAG-based privacy features. 
2. **[LSAG-ts](./packages/lsag-ts)**: TypeScript implementation of Linkable Spontaneous Anonymous Group (LSAG) signatures. Extends SAG for privacy with linkability to prevent double-spending.
3. **[Metamask-snap](./packages/metamask-snap)**: A MetaMask Snap that allows users to generate and verify ring signatures directly from their MetaMask wallet.
4. **[ring-sig-utils](./packages/ring-sig-utils)**: A collection of utility functions supporting ring signature operations across various implementations.
5. **[Rust verifier](./packages/rust-verifier)**: A high-performance verifier for SAG and LSAG signatures written in Rust. It provides a robust solution for secure, privacy-preserving applications.
6. **[SAG EVM verifier](./packages/sag-evm-verifier)**: An Ethereum-compatible (Solidity) verifier for SAG signatures, enabling on-chain privacy features in smart contracts.
7. **[Documentation](./packages/documentation)**: Comprehensive guides, tutorials, and references for each of the above libraries and implementations.

## 🔐 Who Are We?

**Cypher Lab** is dedicated to making privacy a foundational pillar of the Web3 ecosystem. We believe that privacy is critical to decentralization and that users should have control over their data and identities. Our focus is on building privacy-preserving cryptographic tools that empower developers and users.

Our key projects include:
- **Alice's Ring**: A suite of libraries implementing ring signatures to ensure privacy in blockchain transactions.
- **Privacy Protocols**: We design and develop cryptographic protocols that prioritize user privacy, security, and decentralized control.

Learn more about us on [Cypher Lab's Website](https://www.cypherlab.org/).

## 🛠️ How to Set Up the Repo
To get started with the Alice's Ring monorepo, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Cypher-Laboratory/Alice-s-Ring.git
   cd Alice-s-Ring
   ```
2. **Build All Packages**
   ```bash
   make build
   ```
3. **Run All Tests**
   ```bash
   make test
   ```
4. **Format the Code (Before Commit)**
   ```bash
   make fmt
   ```
5. **Check Code Formatting**
   ```bash
   make fmt-check
   ```

## 🤝 Contribution Guidelines
We welcome contributions! To contribute:

1. **Fork the Repo**: Fork the repository to your own GitHub account.
2. **Create a Branch**: Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Write Your Code**: Implement your changes, ensuring they are well-documented and tested.
4. **Submit a Pull Request**: Push your branch and create a pull request to the main repository.

> NOTE: When creating a pull request, please ensure to provide a clear and concise title along with a detailed description of your changes. Include any relevant context or background information to help reviewers understand the purpose and impact of your modifications.
## 📄 License
Alice’s Ring is open source and licensed under the [MIT License](./LICENSE).

---
Thank you for joining us in our mission to make the Web3 ecosystem more private and secure. If you have any questions or would like to collaborate, feel free to reach out through our [contact page](mailto:contact@cypherlab.org). Together, let's build a more privacy-focused future!

