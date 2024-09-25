use elliptic_curve::PrimeField;
use k256::Scalar;

pub fn scalar_from_hex(hex_string: &str) -> Result<Scalar, String> {
    let hex_string = hex_string.trim_start_matches("0x");

    // Decode the hex string into bytes
    let hex_bytes =
        hex::decode(hex_string).map_err(|_| "Invalid hexadecimal string".to_string())?;

    // Prepare a 32-byte array
    let mut scalar_bytes = [0u8; 32];
    let len = hex_bytes.len();

    // Copy the bytes into the scalar_bytes array, padding with zeros on the left if necessary
    scalar_bytes[32 - len..].copy_from_slice(&hex_bytes);

    // Create Scalar from the 32-byte array
    let scalar = Scalar::from_repr(scalar_bytes.into()).expect("msg");

    Ok(scalar)
}
