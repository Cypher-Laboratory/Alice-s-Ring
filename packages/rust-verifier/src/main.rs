use elliptic_curve::sec1::FromEncodedPoint;
use k256::{AffinePoint, EncodedPoint};
use rust_rs_verifier::{
    lsag_verifier::{verify_b64_lsag, verify_lsag},
    utils::{scalar_from_hex::scalar_from_hex, test_utils::get_ring},
};

fn main() {
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
        scalar_from_hex("4ace0644a51955b024621eabe68b10b5e82abf81e14252077f0e8d0ea74ee84d")
            .unwrap();

    let result = verify_lsag(
        &ring,
        "message".to_string(),
        c,
        &[
            scalar_from_hex("317bfa01984a5121aaaec9349f7e02c9cd6dd4dc542e022bb3651ed6133b07fc")
                .unwrap(),
            scalar_from_hex("6a51d731b398036ed3b3b5cfd206407a35fd11faa2bbad1658bcf9f08b9c5fb8")
                .unwrap(),
            scalar_from_hex("6a51d731b398036ed3b3b5cfd206407a35fd11faa2bbad1658bcf9f08b9c5fb8")
                .unwrap(),
            scalar_from_hex("6a51d731b398036ed3b3b5cfd206407a35fd11faa2bbad1658bcf9f08b9c5fb8")
                .unwrap(),
        ],
        key_image.unwrap(),
        Some("linkability flag".to_string()),
    );

    println!("Is sigValid: {}", result);

    println!("-----------------------------");

    let b64_sig = "eyJtZXNzYWdlIjoibWVzc2FnZSIsInJpbmciOlsiMDIwOGY0ZjM3ZTJkOGY3NGUxOGMxYjhmZGUyMzc0ZDVmMjg0MDJmYjhhYjdmZDFjYzViNzg2YWE0MDg1MWE3MGNiIiwiMDMxNmQ3ZGE3MGJhMjQ3YTZhNDBiYjMxMDE4N2U4Nzg5YjgwYzQ1ZmE2ZGMwMDYxYWJiOGNlZDQ5Y2JlN2Y4ODdmIiwiMDIyMTg2OWNhM2FlMzNiZTNhNzMyN2U5YTAyNzIyMDNhZmE3MmM1MmE1NDYwY2ViOWY0YTUwOTMwNTMxYmQ5MjZhIiwiMDIzMzdkNmY1NzdlNjZhMjFhNzgzMWMwODdjNjgzNmExYmFlMzcwODZiZjQzMTQwMDgxMWFjN2M2ZTk2YzhjY2JiIl0sImMiOiI4NjM3OWI0Mzg2MWU5NTBiNWZhNGI3NTcxYWZmMGM2MDA0NTc4ZTcxMjgwYWFlZGI5OTM4MzNjOWJkZTYzYzQzIiwicmVzcG9uc2VzIjpbImQ2YzE4NTRlZWIxMzJkNTg4NmFjNTkwYzUzMGE1NWE3ZmJhM2Q5MmM0ZWI2ODk2YTcyOGIwYTYxODk5YWQ5MDIiLCI2YTUxZDczMWIzOTgwMzZlZDNiM2I1Y2ZkMjA2NDA3YTM1ZmQxMWZhYTJiYmFkMTY1OGJjZjlmMDhiOWM1ZmI4IiwiNmE1MWQ3MzFiMzk4MDM2ZWQzYjNiNWNmZDIwNjQwN2EzNWZkMTFmYWEyYmJhZDE2NThiY2Y5ZjA4YjljNWZiOCIsIjZhNTFkNzMxYjM5ODAzNmVkM2IzYjVjZmQyMDY0MDdhMzVmZDExZmFhMmJiYWQxNjU4YmNmOWYwOGI5YzVmYjgiXSwiY3VydmUiOiJ7XCJjdXJ2ZVwiOlwiU0VDUDI1NksxXCJ9Iiwia2V5SW1hZ2UiOiIwMjE5MWViOWYwNjM2YTViMWE4N2VkNjZjYzAwZDViM2ZmYTM1ZDRlMDRjNGIyMWM4ZTQ4ZGI5ODdhYmI2MDBiMTEiLCJsaW5rYWJpbGl0eUZsYWciOiJsaW5rYWJpbGl0eSBmbGFnIiwiZXZtV2l0bmVzc2VzIjpbXX0=";

    let _verified = verify_b64_lsag(b64_sig.to_string());
    println!("Is b64_sig valid: {}", _verified);
}
