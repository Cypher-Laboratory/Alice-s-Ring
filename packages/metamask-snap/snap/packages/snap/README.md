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
It can be installed from npmjs:
`npm i @cypher-laboratory/alicesring-snap-sdk`
or
`yarn add @cypher-laboratory/alicesring-snap-sdk`
