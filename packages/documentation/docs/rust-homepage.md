---
id: rust-verifier
title: Rust Verifier for SAG and LSAG Ring Signatures
---
<!-- commented lines should be added once the zk generator is ready -->

# Rust Verifier for SAG and LSAG Ring Signatures

This documentation provides an overview of the Rust crate used for verifying ring signatures generated by Alice's Ring library, supporting both SAG and LSAG schemes. It explains how to use the verifier, links to the existing documentation, and describes its integration with zero-knowledge (zk) proofs for verification on EVM chains.

## Overview

The Rust crate provides verification functionalities for two types of ring signatures:
- **SAG (Spontaneous Anonymous Group Signatures)**
- **LSAG (Linkable Spontaneous Anonymous Group Signature)**

### Supported Verification Schemes

1. **SAG Verification**  
   The crate enables verification of SAG signatures. For more details on how SAG verification works and its integration with this Rust verifier, please refer to the documentation: [SAG Rust Verifier Documentation](SAG/SAG-rust-verifier).

2. **LSAG Verification**  
   The verifier also supports LSAG signature verification. For more details on how LSAG verification works and its integration with this Rust verifier, please refer to the documentation: [LSAG Rust Verifier Documentation](LSAG/LSAG-rust-verifier).
   <!-- In addition to direct verification, this crate can generate zero-knowledge proofs (zk proofs) to attest the validity of LSAG signatures. These zk proofs can be utilized for verification on EVM-compatible blockchain networks. More information about LSAG verification and zk proof generation can be found here: [LSAG Rust Verifier Documentation](LSAG/LSAG-rust-verifier). -->

> **Note:** 
> - The verifier is designed to work with ring signatures generated by Alice's Ring library. It might not be compatible with other ring signature implementations.
> - [Differences between SAG and LSAG schemes are explained here](/docs/ring-signatures)

<!-- ## Zero-Knowledge Proof Generation for LSAGs

A unique feature of this verifier is its ability to generate zk proofs for LSAG signatures. This functionality allows users to create cryptographic proofs that attest to the validity of an LSAG signature without revealing the underlying private data.

### Integration with EVM Chains

The generated zk proofs can be used on Ethereum Virtual Machine (EVM) chains to verify the LSAG signatures. This integration enables seamless on-chain verification, increasing transparency and security in decentralized applications. To understand how these zk proofs can be verified on EVM-compatible chains, please refer to the corresponding documentation: [LSAG EVM Verifier Documentation](LSAG/LSAG-evm-verifier). -->

## Getting Started

To use this Rust verifier for SAG or LSAG signatures, add it to your project as follows:

```toml
[dependencies]
ring_signature_verifier = "0.1.4"
```

> Crate URL: [crates.io/crates/ring_signature_verifier](https://crates.io/crates/ring_signature_verifier)

### Example Usage

Here is a simple example showing how to verify an LSAG signature from a base64-encoded string:

```rust
use ring_signature_verifier::lsag_verifier::verify_b64_lsag;

fn main() {
    // Base64-encoded LSAG signature
    let b64_sig = "eyJtZXNzYWdlIjoibWVzc2FnZSIsInJpbmciOlsiMDIwOGY0ZjM3ZTJkOGY3NGUxOGMxYjhmZGUyMzc0ZDVmMjg0MDJmYjhhYjdmZDFjYzViNzg2YWE0MDg1MWE3MGNiIiwiMDMxNmQ3ZGE3MGJhMjQ3YTZhNDBiYjMxMDE4N2U4Nzg5YjgwYzQ1ZmE2ZGMwMDYxYWJiOGNlZDQ5Y2JlN2Y4ODdmIiwiMDIyMTg2OWNhM2FlMzNiZTNhNzMyN2U5YTAyNzIyMDNhZmE3MmM1MmE1NDYwY2ViOWY0YTUwOTMwNTMxYmQ5MjZhIiwiMDIzMzdkNmY1NzdlNjZhMjFhNzgzMWMwODdjNjgzNmExYmFlMzcwODZiZjQzMTQwMDgxMWFjN2M2ZTk2YzhjY2JiIl0sImMiOiI4NjM3OWI0Mzg2MWU5NTBiNWZhNGI3NTcxYWZmMGM2MDA0NTc4ZTcxMjgwYWFlZGI5OTM4MzNjOWJkZTYzYzQzIiwicmVzcG9uc2VzIjpbImQ2YzE4NTRlZWIxMzJkNTg4NmFjNTkwYzUzMGE1NWE3ZmJhM2Q5MmM0ZWI2ODk2YTcyOGIwYTYxODk5YWQ5MDIiLCI2YTUxZDczMWIzOTgwMzZlZDNiM2I1Y2ZkMjA2NDA3YTM1ZmQxMWZhYTJiYmFkMTY1OGJjZjlmMDhiOWM1ZmI4IiwiNmE1MWQ3MzFiMzk4MDM2ZWQzYjNiNWNmZDIwNjQwN2EzNWZkMTFmYWEyYmJhZDE2NThiY2Y5ZjA4YjljNWZiOCIsIjZhNTFkNzMxYjM5ODAzNmVkM2IzYjVjZmQyMDY0MDdhMzVmZDExZmFhMmJiYWQxNjU4YmNmOWYwOGI5YzVmYjgiXSwiY3VydmUiOiJ7XCJjdXJ2ZVwiOlwiU0VDUDI1NksxXCJ9Iiwia2V5SW1hZ2UiOiIwMjE5MWViOWYwNjM2YTViMWE4N2VkNjZjYzAwZDViM2ZmYTM1ZDRlMDRjNGIyMWM4ZTQ4ZGI5ODdhYmI2MDBiMTEiLCJsaW5rYWJpbGl0eUZsYWciOiJsaW5rYWJpbGl0eSBmbGFnIiwiZXZtV2l0bmVzc2VzIjpbXX0=".to_string();

    // Is signature valid? true
    println!("Is signature valid? {:?}", verify_b64_lsag(b64_sig));
}
```

See more examples in the [SAG Rust Verifier Documentation](SAG/SAG-rust-verifier) and [LSAG Rust Verifier Documentation](LSAG/LSAG-rust-verifier).

<!-- To generate zk proofs for an LSAG signature, use:

```rust
use ring_verifier::lsag;

fn main() {
    let signature = ...; // LSAG signature data
    let zk_proof = lsag::generate_zk_proof(&signature);

    // zk_proof can now be used for on-chain verification
}
``` -->

## Additional Resources

- [SAG Rust Verifier Documentation](SAG/SAG-rust-verifier)
- [LSAG Rust Verifier Documentation](LSAG/LSAG-rust-verifier)
<!-- - [LSAG EVM Verifier Documentation](LSAG/LSAG-evm-verifier) -->

For further details, please consult the linked documentation or contact the library maintainers.

