use std::slice;

/// # Safety
///
#[no_mangle]
pub unsafe extern "C" fn free_32(ptr: *mut u8) {
    unsafe {
        let _ = Box::from_raw(slice::from_raw_parts_mut(ptr, 32));
    }
}

/// # Safety
///
#[no_mangle]
pub unsafe extern "C" fn make_root(
    callback: extern "C" fn(input: *const u8, output: *mut u8),
    leafs_ptr: *const *const u8,
    len: usize,
) -> *mut u8 {
    let leafs = unsafe { slice::from_raw_parts(leafs_ptr, len) }
        .iter()
        .map(|&ptr| unsafe { Vec::from(slice::from_raw_parts(ptr, 1)) })
        .collect::<Vec<Vec<u8>>>();

    
    let mut nodes = leafs.clone();
    while nodes.len() > 1 {
        nodes = nodes
            .chunks(2)
            .map(|chunk| {
                let result = if chunk.len() == 2 {
                    let concat = [chunk[0].as_slice(), chunk[1].as_slice()].concat();
                    let mut buffer: [u8; 32] = [0; 32];
                    callback(concat.as_ptr(), buffer.as_mut_ptr());
                    buffer.to_vec()
                } else {
                    chunk[0].to_vec()
                };
                result
            })
            .collect()
    }

    let root = nodes.into_iter().next().unwrap_or_default(); 
    let boxed_array = root.into_boxed_slice();
    Box::into_raw(boxed_array) as *mut u8
}

