use crate::utils::hash_function;
use std::slice;

/// # Safety
///
/// FFI to Python.
#[no_mangle]
pub unsafe extern "C" fn make_root(leaves_ptr: *const *const u8, len_leaves: usize) -> *mut u8 {
    let mut leaves = unsafe { slice::from_raw_parts(leaves_ptr, len_leaves) }
        .iter()
        .map(|leaf_ptr| unsafe { slice::from_raw_parts(*leaf_ptr, 32).to_vec() })
        .collect::<Vec<Vec<u8>>>();
    let mut node = [0u8; 32];

    while leaves.len() > 1 {
        let mut next_level = Vec::new();

        for leaf_pair in leaves.chunks(2) {
            match leaf_pair {
                [left, right] => hash_function(left, right, &mut node),
                [left] => node.copy_from_slice(left),
                _ => unreachable!(),
            };
            next_level.push(node.to_vec());
        }

        leaves = next_level;
    }

    let root = node;
    let boxed_root = root.to_vec().into_boxed_slice();
    Box::into_raw(boxed_root) as *mut u8
}

/// # Safety
///
#[no_mangle]
pub unsafe extern "C" fn free_root(ptr: *mut u8) {
    unsafe {
        let _ = Box::from_raw(slice::from_raw_parts_mut(ptr, 32));
    }
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

    #[test]
    fn test_make_root() {
        let root = [
            104, 32, 63, 144, 233, 208, 125, 197, 133, 146, 89, 215, 83, 110, 135, 166, 186, 157,
            52, 95, 37, 82, 181, 185, 222, 41, 153, 221, 206, 156, 225, 191,
        ];
        let leaves = setup_leaves();
        let leaves_ptrs: Vec<*const u8> = leaves.iter().map(|leaf| leaf.as_ptr()).collect();

        let root_ptr = unsafe { make_root(leaves_ptrs.as_ptr(), leaves.len()) };
        let result_slice = unsafe { slice::from_raw_parts(root_ptr, 32) };
        let result = result_slice.to_vec();

        assert_eq!(result, root);
        unsafe { free_root(root_ptr) };

        let result_dangling_ptr = unsafe { slice::from_raw_parts(root_ptr, 32) };
        assert_eq!(result_dangling_ptr, [0u8; 32]);
    }
}
