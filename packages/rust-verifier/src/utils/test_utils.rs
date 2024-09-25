use elliptic_curve::sec1::FromEncodedPoint;
use k256::{AffinePoint, EncodedPoint};
use num_bigint::BigUint;
use num_traits::Num;

pub fn get_ring(points: &[(&str, &str)]) -> Vec<AffinePoint> {
    // Convert coordinate strings to BigUint
    let points_biguint: Vec<(BigUint, BigUint)> = points
        .iter()
        .map(|(x_str, y_str)| {
            let x = BigUint::from_str_radix(x_str, 10).unwrap();
            let y = BigUint::from_str_radix(y_str, 10).unwrap();
            (x, y)
        })
        .collect();

    // Helper function to get the field modulus
    fn get_field_modulus() -> BigUint {
        // secp256k1 field modulus p = 2^256 - 2^32 - 977
        let p_hex = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f";
        BigUint::from_str_radix(p_hex, 16).unwrap()
    }

    fn biguint_to_32bytes(n: &BigUint) -> [u8; 32] {
        let n_bytes = n.to_bytes_be();
        let mut bytes = [0u8; 32];
        let len = n_bytes.len();
        if len > 32 {
            // Truncate to the last 32 bytes
            bytes.copy_from_slice(&n_bytes[len - 32..]);
        } else {
            // Pad with zeros on the left
            bytes[32 - len..].copy_from_slice(&n_bytes);
        }
        bytes
    }

    // Convert BigUint coordinates to AffinePoint instances
    points_biguint
        .iter()
        .map(|(x_biguint, y_biguint)| {
            let field_modulus = get_field_modulus();

            // Reduce x and y modulo the field modulus
            let x_mod = x_biguint.clone() % &field_modulus;
            let y_mod = y_biguint.clone() % &field_modulus;

            // Convert BigUint to 32-byte arrays
            let x_bytes = biguint_to_32bytes(&x_mod);
            let y_bytes = biguint_to_32bytes(&y_mod);

            // Create an EncodedPoint with uncompressed form
            let encoded_point = EncodedPoint::from_affine_coordinates(
                &x_bytes.into(),
                &y_bytes.into(),
                /* compress = */ false,
            );

            // Convert EncodedPoint to AffinePoint
            AffinePoint::from_encoded_point(&encoded_point).unwrap()
        })
        .collect()
}
