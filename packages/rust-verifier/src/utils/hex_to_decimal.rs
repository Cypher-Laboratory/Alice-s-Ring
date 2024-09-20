use num_bigint::BigUint;
use num_traits::Num;

pub fn hex_to_decimal(hex_string: &str) -> Result<String, String> {
    // Validate input length
    if hex_string.len() != 64 {
        return Err("Input must be a 64-character hex string (32 bytes)".to_string());
    }

    // Parse hex string to BigUint
    let big_num = BigUint::from_str_radix(hex_string, 16)
        .map_err(|e| format!("Failed to parse hex string: {}", e))?;

    // Convert BigUint to decimal string
    Ok(big_num.to_string())
}
