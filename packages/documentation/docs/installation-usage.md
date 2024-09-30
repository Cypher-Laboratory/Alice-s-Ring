---
id: installation-usage
title: Installation & Usage
sidebar_position: 3
---

## Installation & Usage

To install the Ring Signature Snap, you need to have the MetaMask browser extension installed. You can manually install the Snap from the [MetaMask Snap Store](https://snaps.metamask.io/snap/npm/cypher-laboratory/alicesring-snap/) or install it automatically when a DApp requests it.

The easiest way to interact with the Ring Signature Snap is by using the Ring Signature Snap toolkit. The toolkit simplifies the process of utilizing the Snap’s functionalities and can be easily integrated into your project.

You can find the toolkit on [npmjs](https://www.npmjs.com/package/@cypher-laboratory/alicesring-snap-sdk) and its source code on [GitHub](https://github.com/Cypher-Laboratory/Alice-s-Ring-snap-toolkit).

### Installing the Toolkit

You can install the toolkit via npm or yarn:

```sh
npm install @cypher-laboratory/alicesring-snap-sdk
```

or

```sh
yarn add @cypher-laboratory/alicesring-snap-sdk
```

### Using the Toolkit

Below are examples of how to use each function provided by the toolkit along with explanations.

#### Install the Snap

The `installSnap` function installs the Ring Signature Snap into MetaMask. This function requires user approval.

```javascript
import { installSnap } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const isInstalled = await installSnap();
  if (isInstalled) {
    console.log('Snap installed successfully!');
  } else {
    console.log('Failed to install the Snap.');
  }
})();
```

#### Generate a New Account

The `generateAccount` function generates a new Ethereum account within the Snap. This function requires user approval.

```javascript
import { generateAccount } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const success = await generateAccount();
  if (success) {
    console.log('Account generated successfully!');
  } else {
    console.log('Failed to generate account.');
  }
})();
```

#### Import an Account

The `importAccount` function imports an Ethereum account into the Snap using a mnemonic. This function requires user approval.

```javascript
import { importAccount } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const success = await importAccount();
  if (success) {
    console.log('Account imported successfully!');
  } else {
    console.log('Failed to import account.');
  }
})();
```

#### Get Addresses of All Accounts

The `getAddresses` function retrieves the addresses of all imported accounts. This function requires user approval.

```javascript
import { getAddresses } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const addresses = await getAddresses();
  console.log('Addresses:', addresses);
})();
```

#### Sign a Message using LSAG

The `LSAG_signature` function signs a message using the Linkable Spontaneous Anonymous Group (LSAG) signature scheme. This function requires user approval.

```javascript
import { LSAG_signature } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const ring = ['PubKey1', 'PubKey2', 'PubKey3']; // eth compressed public key array (without '0x' prefix)
  const message = 'Message to sign';
  const addressToUse = '0xYourAddress';
  const linkabilityFlag = 'linkabilityFlag'; // some data specific to your context in order to customize the key images

  const signature = await LSAG_signature(ring, message, addressToUse, linkabilityFlag);
  console.log('LSAG Signature:', signature);
})();
```

#### Sign a Message using SAG

The `SAG_signature` function signs a message using the Spontaneous Anonymous Group (SAG) signature scheme. This function requires user approval.

```javascript
import { SAG_signature } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const ring = ['PubKey1', 'PubKey2', 'PubKey3']; // eth compressed public key array (without '0x' prefix)
  const message = 'Message to sign';
  const addressToUse = '0xYourAddress';

  const signature = await SAG_signature(ring, message, addressToUse);
  console.log('SAG Signature:', signature);
})();
```

#### Verify an LSAG Signature

The `verifyLSAG` function verifies a Linkable Spontaneous Anonymous Group (LSAG) signature. This function does not require user approval.

```javascript
import { verifyLSAG } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const b64Signature = 'base64Signature';

  const verification = await verifyLSAG(b64Signature);
  console.log('LSAG Verification:', verification);
})();
```

#### Verify a SAG Signature

The `verifySAG` function verifies a Spontaneous Anonymous Group (SAG) signature. This function does not require user approval.

```javascript
import { verifySAG } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const b64Signature = 'base64Signature';

  const verification = await verifySAG(b64Signature);
  console.log('SAG Verification:', verification);
})();
```

#### Export Key Images

The `exportKeyImages` function exports key images for a list of addresses, which can be used for linkability checks in the LSAG scheme. This function requires user approval.

```javascript
import { exportKeyImages } from '@cypher-laboratory/alicesring-snap-sdk';

(async () => {
  const addresses = ['0xAddress1', '0xAddress2'];
  const linkabilityFlag = 'linkabilityFlag';

  const keyImages = await exportKeyImages(addresses, linkabilityFlag);
  console.log('Key Images:', keyImages);
})();
```
