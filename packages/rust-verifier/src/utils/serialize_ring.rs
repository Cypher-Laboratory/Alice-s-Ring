use k256::AffinePoint;

use super::serialize_point::{deserialize_point, serialize_point};

/// Serializes a ring of points into a string.
/// converts the points to strings and concatenates them.
pub fn serialize_ring(ring: &[AffinePoint]) -> String {
    let mut serialized = String::new();
    for point in ring {
        let point_str = &serialize_point(*point); // public_key_to_bigint(&serialize_point(*point));
        serialized.push_str(point_str);
    }
    serialized
}

pub fn deserialize_ring(ring: &[String]) -> Result<Vec<AffinePoint>, String> {
    let mut deserialized_points = Vec::new();

    for point in ring {
        let deserialized_point = deserialize_point(point.to_string())?;
        deserialized_points.push(deserialized_point);
    }

    Ok(deserialized_points)
}

#[cfg(test)]
mod tests {
    use super::*;
    use elliptic_curve::sec1::FromEncodedPoint;
    use k256::{AffinePoint, EncodedPoint};
    use num_bigint::BigUint;
    use num_traits::Num;

    #[test]
    fn test_serialize_ring() {
        // Define the points as strings
        let points = [
            (
                "10332262407579932743619774205115914274069865521774281655691935407979316086911",
                "100548694955223641708987702795059132275163693243234524297947705729826773642827",
            ),
            (
                "15164162595175125008547705889856181828932143716710538299042410382956573856362",
                "20165396248642806335661137158563863822683438728408180285542980607824890485122",
            ),
            (
                "23289579613515307249488379845935313471996837170244623503719929765426073488571",
                "51508290999221377635014061085578700551081950582306096405012518980034910355762",
            ),
        ];

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
        let ring: Vec<AffinePoint> = points_biguint
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
            .collect();

        let expected_serialized_ring = "0316d7da70ba247a6a40bb310187e8789b80c45fa6dc0061abb8ced49cbe7f887f0221869ca3ae33be3a7327e9a0272203afa72c52a5460ceb9f4a50930531bd926a02337d6f577e66a21a7831c087c6836a1bae37086bf431400811ac7c6e96c8ccbb";
        assert_eq!(serialize_ring(&ring), expected_serialized_ring);
    }
}
