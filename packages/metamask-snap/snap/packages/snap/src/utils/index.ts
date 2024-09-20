import { ManageStateOperation } from '@metamask/snaps-sdk';
import { State } from '../interfaces';

export async function getPrivateKey(address: string): Promise<string> {
  const state: State = (await snap.request({
    method: 'snap_manageState',
    params: { operation: ManageStateOperation.GetState },
  })) as object as State;

  if (!state || !state.account) throw new Error('No account found');

  // get the private key from the account. else throw error
  const privateKey = state.account.find(
    (acc) => acc.address.toLowerCase() === address.toLowerCase(),
  )?.privateKey;

  if (!privateKey) throw new Error('No private key found');

  return privateKey;
}
