use tiny_keccak::{Hasher, Keccak};

pub fn hash_it(data: &[u8], buffer: &mut [u8; 32]) {
    let mut k256 = Keccak::v256();

    k256.update(data);
    k256.finalize(buffer);
}

pub fn hash_function(left: &[u8], right: &[u8], buffer: &mut [u8; 32]) {
    let concat = [left, right].concat();

    hash_it(&concat, buffer)
}

pub fn make_node(hash: [u8; 32], side: u8) -> [u8; 33] {
    let mut node = [0u8; 33];
    node[..32].copy_from_slice(&hash);
    node[32] = side;
    node
}