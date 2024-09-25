use elliptic_curve::sec1::FromEncodedPoint;
use hex::{self, FromHex};
use k256::{elliptic_curve::sec1::ToEncodedPoint, AffinePoint, EncodedPoint};

/// Serializes an AffinePoint to a compressed hexadecimal string
pub fn serialize_point(point: AffinePoint) -> String {
    // Encode the point in uncompressed form to access x and y coordinates
    let encoded = point.to_encoded_point(false); // false for uncompressed

    // Get x and y coordinate bytes
    let x_bytes = encoded.x().expect("x coordinate missing");
    let y_bytes = encoded.y().expect("y coordinate missing");

    // Convert x-coordinate bytes to a hexadecimal string
    let x_hex = hex::encode(x_bytes);

    // Pad the x-coordinate hex string to 64 characters with leading zeros
    let x_hex_padded = format!("{:0>64}", x_hex);

    // Determine if the y-coordinate is even or odd
    // Since y_bytes are in big-endian order, check the least significant bit of the last byte
    let y_is_even = (y_bytes[y_bytes.len() - 1] & 1) == 0;

    // Set the prefix based on the parity of the y-coordinate
    let prefix = if y_is_even { "02" } else { "03" };

    format!("{}{}", prefix, x_hex_padded)
}

/// Deserialize a compressed hexadecimal string to an AffinePoint
pub fn deserialize_point(hex_str: String) -> Result<AffinePoint, String> {
    // Step 1: Convert the hexadecimal string to bytes
    let bytes = match Vec::from_hex(hex_str) {
        Ok(b) => b,
        Err(_) => return Err("Invalid hexadecimal string".to_string()),
    };

    if bytes.len() != 33 {
        return Err("Invalid length for a compressed point".to_string());
    }

    let encoded_point = EncodedPoint::from_bytes(&bytes)
        .map_err(|_| "Invalid compressed point encoding".to_string())?;

    let affine_point = AffinePoint::from_encoded_point(&encoded_point);

    Ok(affine_point.unwrap())
}
