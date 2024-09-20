import { OnRpcRequestHandler, UnauthorizedError } from '@metamask/snaps-sdk';
import {
  exportAccount,
  getAddresses,
  getNewAccount,
  importAccount,
} from './rpc/account';
import { LSAG_Signature } from './rpc/LSAG_Signature';
import { PAC_LSAG_Signature } from './rpc/PAC_LSAG_Signature';
import { getKeyImages } from './rpc/getKeyImages';
import { SAG_Signature } from './rpc/SAG_Signature';
import { verifyLSAG, verifySAG } from './rpc/verify';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'newAccount': // newAccount -> called by the front end to create a new account (requires user approval)
      return (await getNewAccount()) as any; // as any, else 'onRpcRequest' is marked as error

    case 'importAccount': // importAccount -> called by the front end to import an account (requires user approval) (user write is mnemonic directly in the snap dialog)
      return await importAccount();

    case 'exportAccount': {
      // exportAccount -> called by the front end to export an account (requires user approval) (front end does access the mnemonic. user have to copy it from the snap dialog and paste it in a safe place)
      const address = (request.params as { address: string }).address;
      if (!address) throw new UnauthorizedError('a valid address is required');
      return await exportAccount(address);
    }

    case 'getAddresses': // getAddresses -> called by the front end to get the list of addresses in the snap (requires user approval)
      return await getAddresses();

    case 'SAG_Signature': {
      // SAG_Signature -> called by the front end to sign a message using the SAG scheme (requires user approval)
      const { ring, message, addressToUse } = request.params as {
        ring: string[];
        message: string;
        addressToUse: string;
      };
      return await SAG_Signature(ring, message, addressToUse);
    }

    case 'LSAG_Signature': {
      // LSAG_Signature -> called by the front end to sign a message using the LSAG scheme (requires user approval)
      const { ring, message, addressToUse, linkabilityFlag } =
        request.params as {
          ring: string[];
          message: string;
          addressToUse: string;
          linkabilityFlag: string;
        };
      return await LSAG_Signature(ring, message, addressToUse, linkabilityFlag);
    }

    case 'PrivateAirdropClaim_LSAG_Signature': // PrivateAirdropClaim_LSAG_Signature -> called by the front end to sign a claim for a private airdrop (endpoint used for the cypherlab x iexec poc) (requires user approval)
      const payload = request.params as {
        ring: string[];
        claim_contract_address: string;
        addressToUse: string;
        airdropTier: string;
        chainId: string;
      };
      return await PAC_LSAG_Signature(
        payload.ring,
        payload.claim_contract_address,
        payload.addressToUse,
        payload.airdropTier,
        payload.chainId,
      );

    case 'ExportKeyImages': {
      // ExportKeyImages -> called by the front end to export key images (requires user approval)
      const { addresses, linkabilityFactor } = request.params as {
        addresses: string[];
        linkabilityFactor: string;
      };
      return await getKeyImages(addresses, linkabilityFactor);
    }

    case 'Verify_LSAG': {
      // Verify_LSAG -> called silently by the front end to verify any LSAG signature
      const { b64Signature } = request.params as { b64Signature: string };
      return await verifyLSAG(b64Signature);
    }

    case 'Verify_SAG': {
      // Verify_SAG -> called silently by the front end to verify any SAG signature
      const { b64Signature } = request.params as { b64Signature: string };
      return await verifySAG(b64Signature);
    }

    default:
      throw new Error('Ring Signatures: method not found.');
  }
};
