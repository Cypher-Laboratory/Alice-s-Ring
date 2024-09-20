import { RingSignature as LSAGRingSignature } from '@cypher-laboratory/alicesring-lsag';
import { RingSignature as SAGRingSignature } from '@cypher-laboratory/alicesring-sag';

// verify a LSAG signature. return true if the signature is valid, false otherwise.
// if the signature is well encoded, also returns its content
export function verifyLSAG(b64Signature: string): {
  isValid: boolean;
  content: {
    ring: string[];
    challenge: string;
    responses: string[];
    evmWitnesses?: string[] | undefined;
  } | null;
} {
  try {
    const sig = LSAGRingSignature.fromBase64(b64Signature);

    return {
      isValid: sig.verify().valid,
      content: {
        ring: sig.getRing().map((point) => point.serialize()),
        challenge: sig.getChallenge().toString(),
        responses: sig.getResponses().map((response) => response.toString()),
        evmWitnesses:
          sig.getEvmWitnesses() && sig.getEvmWitnesses().length > 0
            ? sig.getEvmWitnesses().map((witness) => witness.toString())
            : undefined,
      },
    };
  } catch (e) {
    console.log('cannot decoded and/or verify the LSAG signature');
  }
  return { isValid: false, content: null };
}

// verify a SAG signature. return true if the signature is valid, false otherwise.
// if the signature is well encoded, also returns its content
export function verifySAG(b64Signature: string): {
  isValid: boolean;
  content: { ring: string[]; challenge: string; responses: string[] } | null;
} {
  try {
    const sig = SAGRingSignature.fromBase64(b64Signature);

    return {
      isValid: sig.verify(),
      content: {
        ring: sig.getRing().map((point) => point.serialize()),
        challenge: sig.getChallenge().toString(),
        responses: sig.getResponses().map((response) => response.toString()),
      },
    };
  } catch (e) {
    console.log('cannot decoded and/or verify the SAG signature');
  }
  return { isValid: false, content: null };
}
