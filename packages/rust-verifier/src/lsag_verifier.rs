use crate::utils::keccak256::keccak_256;
use crate::utils::scalar_from_hex::scalar_from_hex;
use crate::utils::serialize_point::{deserialize_point, serialize_point};
use crate::utils::serialize_ring::{deserialize_ring, serialize_ring};
use crate::utils::{hash_to_secp256k1::hash_to_secp256k1, hex_to_decimal::hex_to_decimal};
use base64::engine::general_purpose;
use base64::Engine;
use core::str;
use k256::{AffinePoint, Scalar};
use serde::Deserialize;

/// Define a struct that matches the structure of the JSON string LSAG
#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct StringifiedLsag {
    pub message: String,
    pub ring: Vec<String>,
    pub c: String,
    pub responses: Vec<String>,
    pub keyImage: String,
    pub linkabilityFlag: String,
}
/// A struct to represent a LSAG signature
pub struct Lsag {
    pub ring: Vec<AffinePoint>,
    pub message: String,
    pub c0: Scalar,
    pub responses: Vec<Scalar>,
    pub key_image: AffinePoint,
    pub linkability_flag: Option<String>,
}
/// Parameters required for the compute_c function
pub struct Params {
    pub index: usize,
    pub previous_r: Scalar,
    pub previous_c: Scalar,
    pub previous_index: usize,
    pub linkability_flag: Option<String>,
    pub key_image: AffinePoint,
}

/// Computes the 'cee' value based on the provided parameters
pub fn compute_c(
    ring: &[AffinePoint], // todo: ensure ring is sorted
    serialized_ring: String,
    message_digest: String,
    params: &Params,
    // curve_order: Scalar,
) -> Scalar {
    let g = AffinePoint::GENERATOR;

    let point =
        ((g * params.previous_r) + (ring[params.previous_index] * params.previous_c)).to_affine();

    let mapped = hash_to_secp256k1(
        serialize_point(ring[params.previous_index])
            + &params.linkability_flag.clone().unwrap_or("".to_string()),
    );

    let hash_content = "".to_string()
        + &serialized_ring
        + &hex_to_decimal(&message_digest).unwrap()
        + &serialize_point(point)
        + &serialize_point(
            ((mapped * params.previous_r) + (params.key_image * params.previous_c)).to_affine(),
        );

    let hash = keccak_256(&[hash_content]);

    scalar_from_hex(&hash).unwrap() // todo: compute mod order: % curve_order;
}

// Function to convert a JSON string into a Rust struct
fn convert_string_to_json(json_str: &str) -> StringifiedLsag {
    // Deserialize the JSON string into the Rust struct
    serde_json::from_str(json_str).unwrap()
}

/// Verify a base64 encoded LSAG signature.
/// Converts a base64 encoded LSAG signature and verifies it.
pub fn verify_b64_lsag(b64_signature: String) -> bool {
    // Decode the base64 string
    let decoded_bytes = general_purpose::STANDARD
        .decode(b64_signature.as_bytes())
        .unwrap();

    // Convert the byte array to utf8 string
    let decoded_string = match str::from_utf8(&decoded_bytes) {
        Ok(ascii) => ascii,
        Err(_) => panic!("Failed to convert decoded bytes to ASCII string"),
    };

    // Convert the string to json
    let json = convert_string_to_json(decoded_string); // Assume the conversion returns a Result

    // Deserialize the ring (handle Result)
    let ring_points = match deserialize_ring(&json.ring) {
        Ok(points) => points,
        Err(e) => {
            println!("Error deserializing ring: {}", e);
            return false; // Return false if deserialization fails
        }
    };

    let key_image = match deserialize_point(json.keyImage.clone()) {
        Ok(point) => point,
        Err(e) => {
            println!("Error deserializing keyImage: {}", e);
            return false; // Return false if deserialization fails
        }
    };

    let responses: Vec<Scalar> = json
        .responses
        .iter()
        .map(|response| scalar_from_hex(response).unwrap())
        .collect();

    // return the result of the verification
    let lsag_signature = Lsag {
        ring: ring_points,
        message: json.message.clone(),
        c0: scalar_from_hex(&json.c).unwrap(),
        responses,
        key_image,
        linkability_flag: Some(json.linkabilityFlag.clone()),
    };

    // Return the result of the verification
    verify_lsag(lsag_signature)
}

/// Verifies a ring signature.
/// Returns `true` if the signature is valid, `false` otherwise.
pub fn verify_lsag(signature: Lsag) -> bool {
    // // Check that all points in the ring are valid // todo: implement for rust
    // for point in ring {
    //     if !check_low_order(point) { // todo: add the check_low_order function
    //         panic!("The public key {:?} is not valid", point);
    //     }
    // }

    // Ensure that the ring and responses have matching lengths
    if signature.ring.len() != signature.responses.len() {
        panic!("Ring and responses must have the same length");
    }
    let message_digest = keccak_256(&[signature.message]);

    let serialized_ring = serialize_ring(&signature.ring);

    // Initialize last_computed_c with c0
    let mut last_computed_c = signature.c0;

    // Compute the c values: c1', c2', ..., cn', c0'
    for i in signature
        .responses
        .iter()
        .enumerate()
        .take(signature.ring.len())
    {
        let params = Params {
            index: (i.0 + 1) % signature.ring.len(),
            previous_r: signature.responses[i.0],
            previous_c: last_computed_c,
            previous_index: i.0,
            key_image: signature.key_image,
            linkability_flag: signature.linkability_flag.clone(),
        };

        let c = compute_c(
            &signature.ring,
            serialized_ring.clone(),
            message_digest.clone(),
            &params,
        );

        last_computed_c = c;
    }

    // Return true if c0 == c0'
    signature.c0 == last_computed_c
}
#[cfg(test)]
mod tests {
    use super::verify_lsag;
    use crate::{
        lsag_verifier::{compute_c, Lsag, Params},
        utils::{
            scalar_from_hex::scalar_from_hex, scalar_to_string::scalar_to_string,
            serialize_point::deserialize_point, test_utils::get_ring,
        },
    };
    use elliptic_curve::{sec1::FromEncodedPoint, PrimeField};
    use k256::{AffinePoint, EncodedPoint, Scalar};

    #[test]
    fn test_compute_c() {
        let ring = get_ring(&[
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
        ]);

        let key_image = ring[0];

        let params = Params {
            index: 2,
            previous_r: Scalar::from_u128(123),
            previous_c: Scalar::from_u128(456),
            previous_index: 1,
            linkability_flag: Some("string".to_string()),
            key_image,
        };

        let result = compute_c(
            &ring,
            "103322624075799327436197742051159142740698655217742816556919354079793160869111151641625951751250085477058898561818289321437167105382990424103829565738563622232895796135153072494883798459353134719968371702446235037199297654260734885712".to_string(),
            "00000000000000000000000000000000000000000000000000000000075BCD15".to_string(), // hex for "123456789" (padded to 32 bytes)
            &params,
        );
        let expected_result = "9417d5df80043f0a291210af035900c6863a560836fe23b25fc92b46fd87cb16";
        assert_eq!(scalar_to_string(&result), expected_result);
    }

    #[test]
    fn test_verify_lsag() {
        // Define the points as strings
        let points = [
            (
                "4051293998585674784991639592782214972820158391371785981004352359465450369227",
                "88166831356626186178414913298033275054086243781277878360288998796587140930350",
            ),
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
        let ring = get_ring(&points);

        let x = scalar_from_hex("191eb9f0636a5b1a87ed66cc00d5b3ffa35d4e04c4b21c8e48db987abb600b11");
        let y = scalar_from_hex("2cdf899ff765f26abb272b8228ccc4b1f69192e614d9c0d44a52b78bb9af8774");
        let key_image = AffinePoint::from_encoded_point(&EncodedPoint::from_affine_coordinates(
            &x.unwrap().into(),
            &y.unwrap().into(),
            false,
        ));
        let c: k256::Scalar =
            scalar_from_hex("86379b43861e950b5fa4b7571aff0c6004578e71280aaedb993833c9bde63c43")
                .unwrap();

        let lsag_signature = Lsag {
            ring,
            message: "message".to_string(),
            c0: c,
            responses: [
                scalar_from_hex("d6c1854eeb132d5886ac590c530a55a7fba3d92c4eb6896a728b0a61899ad902")
                    .unwrap(),
                scalar_from_hex("6a51d731b398036ed3b3b5cfd206407a35fd11faa2bbad1658bcf9f08b9c5fb8")
                    .unwrap(),
                scalar_from_hex("6a51d731b398036ed3b3b5cfd206407a35fd11faa2bbad1658bcf9f08b9c5fb8")
                    .unwrap(),
                scalar_from_hex("6a51d731b398036ed3b3b5cfd206407a35fd11faa2bbad1658bcf9f08b9c5fb8")
                    .unwrap(),
            ]
            .to_vec(),
            key_image: key_image.unwrap(),
            linkability_flag: Some("linkability flag".to_string()),
        };
        let result = verify_lsag(lsag_signature);

        assert!(result);
    }

    use serde_json::Value;
    use std::fs;
    /// Test the `verify_lsag` function using test data from the `lsag` package.
    #[test]
    fn test_verify_lsag_from_ts_package() {
        // Load the JSON signature data from `../../lsag-ts/test/data/jsonSignatures.json`
        let data = fs::read_to_string("../lsag-ts/test/data/jsonSignatures.json")
            .expect("Unable to read json file");

        // Parse the JSON data
        let json_data: Value = serde_json::from_str(&data).expect("JSON was not well-formatted");

        // Extract the "valid" signature data from the JSON
        let signature_data = &json_data["valid"];

        // Deserialize the message
        let message = signature_data["message"]
            .as_str()
            .expect("message should be a string")
            .to_string();

        // Deserialize the ring (points)
        let ring: Vec<AffinePoint> = signature_data["ring"]
            .as_array()
            .expect("ring should be an array")
            .iter()
            .map(|s| {
                deserialize_point(
                    s.as_str()
                        .expect("ring entry should be a string")
                        .to_string(),
                )
                .expect("failed to deserialize ring point")
            })
            .collect();

        // Deserialize the key image
        let key_image_str = signature_data["keyImage"]
            .as_str()
            .expect("keyImage should be a string")
            .to_string();
        let key_image = deserialize_point(key_image_str).expect("failed to deserialize key image");

        // Deserialize the challenge scalar `c`
        let c = scalar_from_hex(signature_data["c"].as_str().expect("c should be a string"))
            .expect("failed to parse c");

        // Deserialize the response scalars
        let responses: Vec<Scalar> = signature_data["responses"]
            .as_array()
            .expect("responses should be an array")
            .iter()
            .map(|r| {
                scalar_from_hex(r.as_str().expect("response should be a string"))
                    .expect("failed to parse response scalar")
            })
            .collect();

        // Get the linkability flag
        let linkability_flag = signature_data["linkabilityFlag"]
            .as_str()
            .expect("linkabilityFlag should be a string")
            .to_string();

        // Call `verify_lsag` and check the result
        let lsag_signature = Lsag {
            ring,
            message,
            c0: c,
            responses,
            key_image,
            linkability_flag: Some(linkability_flag),
        };
        let result = verify_lsag(lsag_signature);

        // Verify that the LSAG signature is valid
        assert!(result, "The LSAG signature should be valid.");
    }

    // todo: test to verify a signature from a base64 string from the lsag package
}
