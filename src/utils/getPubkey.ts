import { Curve } from ".";
import * as elliptic from "elliptic";

export function getPublicKey(
  signerPrivKey: bigint,
  curve: Curve,
): [bigint, bigint] {
  /* eslint-disable indent */
  switch (curve) {
    case Curve.SECP256K1:
      return getSecp256k1PublicKey(signerPrivKey);
    case Curve.ED25519:
      return getEd25519PublicKey(signerPrivKey);
    default:
      throw new Error("Curve not supported");
  }
}

function getSecp256k1PublicKey(privKey: bigint): [bigint, bigint] {
  // Create an instance of the secp256k1 curve
  const ec = new elliptic.ec("secp256k1");

  // Replace 'yourPrivateKey' with your actual private key
  const privateKeyHex = privKey.toString(16);

  // Create a privateKey object from the hex string
  const privateKey = ec.keyFromPrivate(privateKeyHex, "hex");

  // Derive the public key from the private key
  const publicKey = privateKey.getPublic();

  return [
    BigInt(publicKey.getX().toString()),
    BigInt(publicKey.getY().toString()),
  ];
}

function getEd25519PublicKey(privKey: bigint): [bigint, bigint] {
  // Create an instance of the ed25519 curve
  const ec = new elliptic.ec("ed25519");

  // Replace 'yourPrivateKey' with your actual private key
  const privateKeyHex = privKey.toString(16);

  // Create a privateKey object from the hex string
  const privateKey = ec.keyFromPrivate(privateKeyHex, "hex");

  // Derive the public key from the private key
  const publicKey = privateKey.getPublic();

  return [
    BigInt(publicKey.getX().toString()),
    BigInt(publicKey.getY().toString()),
  ];
}
