use crate::merkle_root::make_root;
use crate::utils::make_node;
use std::slice;

#[repr(C)]
pub struct MerkleProof {
    ptr: *mut *mut u8,
    len: usize,
}

/// Constructs a Merkle proof for the given leaf.
#[no_mangle]
pub unsafe extern "C" fn make_proof(
    leaves_ptr: *const *const u8,
    len_leaves: usize,
    leaf_ptr: *const u8,
) -> MerkleProof {
    let leaf = unsafe { slice::from_raw_parts(leaf_ptr, 32).to_vec() };
    let leaves = unsafe { slice::from_raw_parts(leaves_ptr, len_leaves) }
        .iter()
        .map(|leaf_ptr| unsafe { slice::from_raw_parts(*leaf_ptr, 32).to_vec() })
        .collect::<Vec<Vec<u8>>>();

    let mut proof: Vec<[u8; 33]> = Vec::new();

    let mut current_leaves = leaves.clone();
    while current_leaves.len() > 1 {
        let index = match leaves.iter().position(|x| *x == leaf) {
            Some(i) => i,
            None => panic!("Leaf does not exist in the tree"),
        };
        if current_leaves.len() == 2 {
            if index == 1 {
                // proof.push(Node(data = leaves[0], side = Side.LEFT))
                let left: [u8; 32] = current_leaves[0]
                    .as_slice()
                    .try_into()
                    .expect("Failed to convert LEFT to array");
                let node = make_node(left, 0);
                proof.push(node);
                break;
            } else {
                // proof.append(Node(data = leaves[1], side = Side.RIGHT))
                let right: [u8; 32] = current_leaves[1]
                    .as_slice()
                    .try_into()
                    .expect("Failed to convert RIGHT to array");
                let node = make_node(right, 1);
                proof.push(node);
                break;
            }
        }

        let half_size = current_leaves.len() / 2;

        // divide a lista em 2, left e right
        let (left, right) = current_leaves.split_at(half_size);

        // se o index estiver em left
        if index < half_size {
            // faça a merkle root de right
            let right_ptrs: Vec<*const u8> = right.iter().map(|vec| vec.as_ptr()).collect();
            let right_ptr: *const *const u8 = right_ptrs.as_ptr();

            // TODO: make root must be a async (using other thread)
            let right_root_ptr = make_root(right_ptr, right.len());
            let right_root_raw = slice::from_raw_parts(right_root_ptr, 32);
            let right_root: [u8; 32] = right_root_raw
                .try_into()
                .expect("Failed to convert RIGHT to array");

            // faça o node passando right e 1 (direita)
            let node = make_node(right_root, 1);

            // adicione o node na lista de prova
            proof.push(node);

            current_leaves = left.to_vec();
        } else {
            // se o index estiver em right
            // faça a merkle root de left
            let left_ptrs: Vec<*const u8> = left.iter().map(|vec| vec.as_ptr()).collect();
            let left_ptr: *const *const u8 = left_ptrs.as_ptr();

            // TODO: make root must be a async (using other thread)
            let left_root_ptr = make_root(left_ptr, left.len());
            let left_root_raw = slice::from_raw_parts(left_root_ptr, 32);
            let left_root: [u8; 32] = left_root_raw
                .try_into()
                .expect("Failed to convert LEFT to array");

            // faça o node passando left e 0 (esquerda)
            let node = make_node(left_root, 0);

            // adicione o node na lista de prova
            proof.push(node);

            current_leaves = right.to_vec();
        }
    }

    proof.reverse();
    let len = proof.len();
    let proof_pointers: Vec<*mut u8> = proof
        .into_iter()
        .map(|node| {
            let boxed_node = Box::new(node);
            Box::into_raw(boxed_node) as *mut u8
        })
        .collect();
    let boxed_proof = proof_pointers.into_boxed_slice();
    let ptr = Box::into_raw(boxed_proof) as *mut *mut u8;
    MerkleProof { ptr, len }
}

#[no_mangle]
pub unsafe extern "C" fn free_proof(ptr: *mut *mut u8, len: usize) {
    let slice = slice::from_raw_parts_mut(ptr, len);
    for &mut inner_ptr in slice.iter_mut() {
        let _ = Box::from_raw(inner_ptr);
    }
    let _ = Box::from_raw(ptr);
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup_leaves() -> Vec<[u8; 32]> {
        vec![
            // a
            [
                58, 194, 37, 22, 141, 245, 66, 18, 162, 92, 28, 1, 253, 53, 190, 191, 234, 64, 143,
                218, 194, 227, 29, 221, 111, 128, 164, 187, 249, 165, 241, 203,
            ],
            // b
            [
                181, 85, 61, 227, 21, 224, 237, 245, 4, 217, 21, 10, 248, 45, 175, 165, 196, 102,
                127, 166, 24, 237, 10, 111, 25, 198, 155, 65, 22, 108, 85, 16,
            ],
            // c
            [
                11, 66, 182, 57, 60, 31, 83, 6, 15, 227, 221, 191, 205, 122, 173, 204, 168, 148,
                70, 90, 90, 67, 143, 105, 200, 125, 121, 11, 34, 153, 185, 178,
            ],
            // d
            [
                241, 145, 142, 133, 98, 35, 110, 177, 122, 220, 133, 2, 51, 47, 76, 156, 130, 188,
                20, 225, 155, 252, 10, 161, 10, 182, 116, 255, 117, 179, 210, 243,
            ],
        ]
    }

    fn setup_proof() -> Vec<[u8; 33]> {
        vec![
            [
                181, 85, 61, 227, 21, 224, 237, 245, 4, 217, 21, 10, 248, 45, 175, 165, 196, 102,
                127, 166, 24, 237, 10, 111, 25, 198, 155, 65, 22, 108, 85, 16, 1,
            ],
            [
                210, 83, 165, 45, 76, 176, 13, 226, 137, 94, 133, 242, 82, 158, 41, 118, 230, 170,
                170, 92, 24, 16, 107, 104, 171, 102, 129, 62, 20, 65, 86, 105, 1,
            ],
        ]
    }
    #[test]
    fn test_make_root() {
        let leaves = setup_leaves();
        let proof = setup_proof();
        let leaves_ptrs: Vec<*const u8> = leaves.iter().map(|leaf| leaf.as_ptr()).collect();
        let leaf = leaves[0];
        let leaf_ptr = leaf.as_ptr();

        let result = unsafe { make_proof(leaves_ptrs.as_ptr(), leaves.len(), leaf_ptr) };
        let result_slice = unsafe { slice::from_raw_parts(result.ptr, result.len) }
            .iter()
            .map(|leaf_ptr| unsafe { slice::from_raw_parts(*leaf_ptr, 33).to_vec() })
            .collect::<Vec<Vec<u8>>>();

        assert_eq!(result_slice, proof);

        unsafe { free_proof(result.ptr, result.len) }
        let result_dangling_ptr = unsafe { slice::from_raw_parts(result.ptr, result.len) }
            .iter()
            .map(|leaf_ptr| unsafe { slice::from_raw_parts(*leaf_ptr, 33).to_vec() })
            .collect::<Vec<Vec<u8>>>();
        let expected: Vec<Vec<u8>> = vec![vec![0; 33]; 2];
        assert_eq!(result_dangling_ptr, expected);
    }
}
