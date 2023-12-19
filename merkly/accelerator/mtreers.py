from ctypes import (
    CDLL,
    CFUNCTYPE,
    c_ubyte,
    c_size_t,
    POINTER,
    cast,
    memmove,
)
from typing import List
from Crypto.Hash import keccak as cryptodome_keccak


class MTreers:
    def __init__(self) -> None:
        callback_function = CFUNCTYPE(None, POINTER(c_ubyte), POINTER(c_ubyte))

        @callback_function
        def python_callback(ptr, output_ptr):
            print("PYTHON FROM RUST")
            data = bytes(ptr[:64])

            keccak_256 = cryptodome_keccak.new(digest_bits=256)
            keccak_256.update(data)

            memmove(output_ptr, keccak_256.digest(), 32)

        self.keccak = python_callback

        self.lib = CDLL("./merkly/accelerator/libmerkle_root.dylib")
        self.lib.make_root.argtypes = (
            callback_function,
            POINTER(POINTER(c_ubyte)),
            c_size_t,
        )
        self.lib.make_root.restype = POINTER(c_ubyte)

        self.lib.free_32.argtypes = [POINTER(c_ubyte)]
        self.lib.free_32.restype = None

    def make_root(self, leafs: List[bytes]) -> bytes:
        pointer_array_type = POINTER(c_ubyte) * len(leafs)
        pointers = pointer_array_type(
            *[
                cast((c_ubyte * 32).from_buffer_copy(leaf), POINTER(c_ubyte))
                for leaf in leafs
            ]
        )

        result_ptr = self.lib.make_root(self.keccak, pointers, len(leafs))
        result = bytes(result_ptr[:32])
        self.lib.free_32(result_ptr)

        return result
