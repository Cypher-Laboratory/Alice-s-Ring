use hex;
use sha3::{Digest, Keccak256};

/// The keccak_256 function
/// concatenates the input strings and returns the Keccak256 hash as a hexadecimal string
pub fn keccak_256(input: &[String]) -> String {
    // Convert each element to a string and concatenate them
    let serialized: String = input.iter().map(|x| x.to_string()).collect();

    // Create a Keccak256 hasher instance
    let mut hasher = Keccak256::new();

    // Update the hasher with the serialized input
    hasher.update(serialized.as_bytes());

    // Retrieve the hash result
    let result = hasher.finalize();

    // Convert the hash result to a hexadecimal string
    hex::encode(result)
}

// example of using keccak256
// let input = ["0x1".to_string(), "0x2".to_string(), "0x3".to_string()];

// // Create a Keccak256 hasher instance
// let hashed = utils::keccak256::keccak_256(input.as_ref());

// println!("Input: {}", input.iter().map(|x| x.to_string()).collect::<String>());
// println!("Keccak256 Hash: {}", hashed);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keccak_256() {
        let inputs = ["0x1".to_string(), "0x2".to_string(), "0x3".to_string()];
        let expected_hash = "0c18482d065664ac3239e005e32036242874b938850a67d68f583d56c360e0c4";

        // hash the inputs
        let hashed = keccak_256(inputs.as_ref());

        assert_eq!(hashed, expected_hash);
    }
}
