import {
  DialogType,
  text,
  panel,
  ManageStateOperation,
  heading,
  copyable,
} from '@metamask/snaps-sdk';
import { State } from '../interfaces';
import { ecHash } from '@cypher-laboratory/alicesring-lsag/dist/src/utils/hashFunction';
import { Curve, CurveName } from '@cypher-laboratory/alicesring-lsag';

// get the key images for all the wanted addresses with the desired linkability flag
export async function getKeyImages(
  addresses: string[],
  linkabilityFlag: string,
): Promise<
  { address: string; keyImage: string; linkabilityFlag: string }[] | null
> {
  const state: State = (await snap.request({
    method: 'snap_manageState',
    params: { operation: ManageStateOperation.GetState },
  })) as object as State;

  if (!state || !state.account) {
    return [];
  }

  // else ask for user permission to export key images
  const warning =
    '**Warning:** Exporting key images can be used to link your interactions ';
  if (linkabilityFlag !== '') {
    const approval = await snap.request({
      method: 'snap_dialog',
      params: {
        type: DialogType.Confirmation,
        content: panel([
          heading(`Export key images:`),

          text(
            'Do you let this snap to export the key images of the following addresses?',
          ),

          text(
            /^0x[a-fA-F0-9]{40}$/.test(linkabilityFlag)
              ? warning + 'with the following address'
              : warning + 'with the following address and linkability flag',
          ),
          text('Linkability flag: '),
          copyable(linkabilityFlag),

          text('the key images of the following addresses will be shared: '),
          ...addresses.map((addr) => copyable(addr)),
        ]),
      },
    });

    // console.log('approval:', approval);
    if (!approval) throw new Error('User denied the exportation request');
  } else {
    const approval = await snap.request({
      method: 'snap_dialog',
      params: {
        type: DialogType.Confirmation,
        content: panel([
          heading(`Export key images:`),

          text(
            'Do you let this snap export the key images for the following addresses?',
          ),

          text('**warning**:'),
          text(
            'Anyone with those keyImages can link all you to all your previous Linkable Ring Signatures without linkability flag.',
          ),
          text(
            'Please make sure you are aware of the consequences of exporting key images.',
          ),

          text('the key images of the following addresses will be shared: '),
          ...addresses.map((addr) => copyable(addr)),
        ]),
      },
    });

    // console.log('approval:', approval);
    if (!approval) throw new Error('User denied the exportation request');
  }

  const keyImages: {
    address: string;
    keyImage: string;
    linkabilityFlag: string;
  }[] = [];

  for (const address of addresses) {
    const account = state.account.find(
      (acc) => acc.address.toLowerCase() === address.toLowerCase(),
    );
    const curve = new Curve(CurveName.SECP256K1);

    if (account) {
      const privateKey = BigInt(account.privateKey);
      const signerPubKey = curve.GtoPoint().mult(privateKey);
      const customMapped = ecHash(
        [signerPubKey.serialize()].concat(
          linkabilityFlag !== '' ? [linkabilityFlag] : [],
        ),
        curve,
        // config,
      );
      const keyImage = customMapped.point.mult(privateKey).serialize();
      keyImages.push({ address, keyImage, linkabilityFlag });
    }
  }

  return keyImages;
}
