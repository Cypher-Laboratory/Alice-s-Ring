import {
  Curve,
  CurveName,
  Point,
  RingSignature,
} from '@cypher-laboratory/alicesring-lsag';
import {
  DialogType,
  text,
  panel,
  heading,
  copyable,
} from '@metamask/snaps-sdk';
import { getPrivateKey } from '../utils';

// sign a message using the Linkable SAG scheme, special version adapter for the cypher lab x iexec private claim POC
export async function PAC_LSAG_Signature(
  ring: string[],
  claim_contract_address: string,
  addressToUse: string,
  airdropTier: string,
  chainId: string,
): Promise<string> {
  const secp256k1 = new Curve(CurveName.SECP256K1);
  const deserializedRing = ring.map((point) => Point.deserialize(point));

  // get private key from storage
  const privateKey = await getPrivateKey(addressToUse);

  // get the claimer receiving address:
  let address: string | undefined = undefined;
  let previousIsFalse = false;
  let isInRing = false;
  do {
    const displayedPanel = previousIsFalse
      ? [
          heading('Claimer Address'),
          text(
            '**The last address you entered is invalid. Please enter a valid address**',
          ),
          isInRing
            ? text('**The claimer address cannot be in the ring**')
            : text(''),
          text('Enter the address you will use to claim the reward:'),
        ]
      : [
          heading('Claimer Address'),
          isInRing
            ? text('**The claimer address cannot be in the ring**')
            : text(''),
          text('Enter the address you will use to claim the reward:'),
        ];

    address = (
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: DialogType.Prompt,
          content: panel(displayedPanel),
        },
      })
    )?.toString();

    if (address === undefined)
      throw new Error('User cancelled the lsag signature process');

    if (!address || !/^(0x)?[0-9a-fA-F]{40}$/.test(address as string))
      previousIsFalse = true;

    // check if the receiving address is in the ring
    if (
      address &&
      ring.find(
        (point) =>
          Point.deserialize(point).toEthAddress().toLowerCase() ===
            address!.toLowerCase() ||
          addressToUse.toLowerCase() === address!.toLowerCase(),
      )
    ) {
      isInRing = true;
    }

    // check if the address is a valid hex string with 42 characters. if it is not, ask the user to enter a valid address
  } while (
    !address ||
    !/^(0x)?[0-9a-fA-F]{40}$/.test(address as string) ||
    isInRing
  );

  const message = JSON.stringify({
    claimContractAddress: claim_contract_address,
    claimerAddress: address,
    tier: airdropTier,
    chainId,
  });

  const approval = await snap.request({
    method: 'snap_dialog',
    params: {
      type: DialogType.Confirmation,
      content: panel([
        heading(`Ring Sign a message:`),
        // text('Signature process can take up to 20 seconds. please wait.'),
        text('Let this snap to sign these content?'),
        text('Claim contract address: '),
        copyable(claim_contract_address),
        text('Claimer address: '),
        copyable(address as string),
        text('Airdrop Tier: ' + airdropTier),
        text('Chain ID: ' + chainId),
        text('Ring size: ' + ring.length),
        text('Message:'),
        copyable(message),
      ]),
    },
  });

  if (!approval) throw new Error('User denied signing message');

  const signature = RingSignature.sign(
    deserializedRing,
    BigInt(privateKey),
    message,
    secp256k1,
    claim_contract_address,
  );

  return signature.toBase64();
}
