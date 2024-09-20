import {
  Curve,
  CurveName,
  Point,
  RingSignature,
} from '@cypher-laboratory/alicesring-sag';
import {
  DialogType,
  text,
  panel,
  heading,
  copyable,
} from '@metamask/snaps-sdk';
import { getPrivateKey } from '../utils';

// sign a message using the SAG scheme
export async function SAG_Signature(
  ring: string[],
  message: string,
  addressToUse: string,
): Promise<string> {
  const secp256k1 = new Curve(CurveName.SECP256K1);
  const deserializedRing = ring.map((point) => Point.deserialize(point));

  // get private key from storage
  const privateKey = await getPrivateKey(addressToUse);

  const approval = await snap.request({
    method: 'snap_dialog',
    params: {
      type: DialogType.Confirmation,
      content: panel([
        heading(`Ring Sign a message:`),
        // text('Signature process can take up to 20 seconds. please wait.'),
        text('Let this snap sign these content using ring signature?'),
        text('(masked) signer address: '),
        copyable(addressToUse),
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
    { evmCompatibility: true },
  );

  return signature.toBase64();
}
