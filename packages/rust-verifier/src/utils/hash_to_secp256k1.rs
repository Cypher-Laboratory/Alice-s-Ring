use elliptic_curve::AffinePoint;
use k256::elliptic_curve::hash2curve::{ExpandMsgXmd, GroupDigest};
use k256::Secp256k1;
use sha2::Sha256;

pub fn hash_to_secp256k1(message: String) -> AffinePoint<Secp256k1> {
    let msg = message.as_bytes();

    const DST: &[u8] = b"secp256k1_XMD:SHA-256_SSWU_RO_";

    let point = Secp256k1::hash_from_bytes::<ExpandMsgXmd<Sha256>>(&[msg], &[DST]).unwrap();

    point.to_affine()
}
