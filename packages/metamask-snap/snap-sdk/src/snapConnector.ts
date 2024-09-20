import detectEthereumProvider from "@metamask/detect-provider";

const PACKAGE_NAME = "@cypher-laboratory/alicesring-snap";

declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    ethereum?: any;
  }
}

/**
 * Check if the ring signature snap is installed and install
 *
 * @param onlyFlask - If true, requires only metamask flask to be installed before installing the snap (used for development)
 *
 * @returns true if snap is the snap is/has been installed, false otherwise
 */
export async function installSnap(onlyFlask = false): Promise<boolean> {
  // This resolves to the value of window.ethereum or null
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const provider: any = await detectEthereumProvider();

  // web3_clientVersion returns the installed MetaMask version as a string
  const isFlask = (
    await provider?.request({ method: "web3_clientVersion" })
  )?.includes("flask"); // todo: once snap allowed by metamask, remove this check

  if (onlyFlask && !isFlask) {
    console.error("Please install MetaMask FLASK first");
    return false;
  }

  if (provider) {
    try {
      // install snap
      await window.ethereum.request({
        method: "wallet_requestSnaps",
        params: {
          [`npm:${PACKAGE_NAME}`]: {},
        },
      });
      console.log(
        "MetaMask Flask & airdrop claimer SNAP successfully detected!",
      );
    } catch (error) {
      console.error(`Error while installing ${PACKAGE_NAME}`);
    }

    // check if snap is installed
    if (!detectRingSignatureSnap()) {
      console.error("Snap not installed. Please try again.");
      return false;
    }
    return true;
  } else {
    console.error("Please install MetaMask flask first");
    return false;
  }
}

/**
 * Check if the ring signature snap is installed
 *
 * @returns true if snap is the snap is installed, false otherwise
 */
export async function detectRingSignatureSnap(): Promise<boolean> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const provider: any = await detectEthereumProvider();
  const snaps = await provider?.request({
    method: "wallet_getSnaps",
  });

  const isMySnapInstalled = Object.keys(snaps).includes(`npm:${PACKAGE_NAME}`);

  if (isMySnapInstalled) {
    return true;
  } else {
    return false;
  }
}

// generate new account: "newAccount"
export async function generateAccount() {
  try {
    await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "newAccount",
        },
      },
    });
    // alert('Account generated successfully!');
  } catch (error) {
    console.error("Error while generating account");
    return false;
  }
  return true;
}

// import account: "importAccount"
export async function importAccount(): Promise<boolean> {
  try {
    await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "importAccount",
          // params,
        },
      },
    });
    // console.log('account:', account);
    // alert('Account imported successfully!');
  } catch (error) {
    console.error("Error while importing account");
    return false;
  }
  return true;
}

// get addresses of all accounts: "getAddresses"
export async function getAddresses(): Promise<string[]> {
  try {
    const addresses = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "getAddresses",
          // params,
        },
      },
    });
    // console.log('addresses:', JSON.parse(addresses).addresses);
    return JSON.parse(addresses).addresses;
  } catch (error) {
    console.error("Error while getting addresses");
    return [];
  }
}

// lsag sign message: "LSAG_signature"
export async function LSAG_signature(
  ring: string[],
  message: string,
  addressToUse: string,
  linkabilityFlag: string,
): Promise<string> {
  try {
    const signature = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "LSAG_Signature",
          params: {
            ring,
            message,
            addressToUse,
            linkabilityFlag,
          },
        },
      },
    });
    console.log("signature:", signature);
    // alert('Message signed successfully!');
    return signature;
  } catch (error) {
    console.error("Error while signing message");
    return "";
  }
}

// lsag sign message: "LSAG_signature"
export async function PAC_LSAG_Signature(
  ring: string[],
  claim_contract_address: string,
  addressToUse: string,
  airdropTier: string,
  chainId: string,
): Promise<string> {
  try {
    const signature = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "PrivateAirdropClaim_LSAG_Signature",
          params: {
            ring,
            claim_contract_address,
            addressToUse,
            airdropTier,
            chainId,
          },
        },
      },
    });
    // console.log('signature:', signature);
    // alert('Message signed successfully!');
    return signature;
  } catch (error) {
    console.error("Error while signing message");
    return "";
  }
}

export async function exportKeyImages(
  addresses: string[],
  linkabilityFlag: string,
): Promise<
  { address: string; keyImage: string; linkabilityFlag: string }[] | null
> {
  try {
    const keyImages = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "ExportKeyImages",
          params: {
            addresses,
            linkabilityFactor: linkabilityFlag,
          },
        },
      },
    });
    // console.log('keyImage:', JSON.parse(addresses).addresses);
    return keyImages;
  } catch (error) {
    console.error("Error while getting addresses");
    return null;
  }
}

// sag sign message: "SAG_signature"
export async function SAG_signature(
  ring: string[],
  message: string,
  addressToUse: string,
): Promise<string> {
  try {
    const signature = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "SAG_Signature",
          params: {
            ring,
            message,
            addressToUse,
          },
        },
      },
    });
    // console.log('signature:', signature);
    // alert('Message signed successfully!');
    return signature;
  } catch (error) {
    console.error("Error while signing message");
    return "";
  }
}

// silently verify lsag signature: "Verify_LSAG"
export async function verifyLSAG(b64Signature: string): Promise<{
  isValid: boolean;
  content: { ring: string[]; challenge: string; responses: string[] } | null;
} | null> {
  try {
    const verification = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "Verify_LSAG",
          params: {
            b64Signature,
          },
        },
      },
    });
    // console.log('verification:', verification);
    return verification;
  } catch (error) {
    console.error("Error while verifying signature:\n", error);
    return null;
  }
}

// silently verify sag signature: "Verify_SAG"
export async function verifySAG(b64Signature: string): Promise<{
  isValid: boolean;
  content: { ring: string[]; challenge: string; responses: string[] } | null;
} | null> {
  try {
    const verification = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: `npm:${PACKAGE_NAME}`,
        request: {
          method: "Verify_SAG",
          params: {
            b64Signature,
          },
        },
      },
    });
    // console.log('verification:', verification);
    return verification;
  } catch (error) {
    console.error("Error while verifying signature");
    return null;
  }
}
