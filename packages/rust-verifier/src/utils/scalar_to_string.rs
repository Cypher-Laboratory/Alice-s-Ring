use k256::Scalar;

pub fn scalar_to_string(scalar: &Scalar) -> String {
    let scalar_bytes = scalar.to_bytes();
    hex::encode(scalar_bytes)
}
