from ctypes import CDLL, POINTER, Structure, c_size_t, c_ubyte
from merkly.node import Node
from typing import List


class MerkleProof(Structure):
    _fields_ = [("ptr", POINTER(POINTER(c_ubyte))), ("len", c_size_t)]


class MTreers:
    def __init__(self) -> None:
        self.lib = CDLL("./merkly/accelerator/libaccelerator.dylib")

        self.lib.make_root.argtypes = [POINTER(POINTER(c_ubyte)), c_size_t]
        self.lib.make_root.restype = POINTER(c_ubyte)

        self.lib.free_root.argtypes = [POINTER(c_ubyte)]
        self.lib.free_root.restype = None

        self.lib.make_proof.argtypes = [
            POINTER(POINTER(c_ubyte)),
            c_size_t,
            POINTER(c_ubyte),
        ]
        self.lib.make_proof.restype = MerkleProof

        self.lib.free_proof.argtypes = [POINTER(POINTER(c_ubyte))]
        self.lib.free_proof.restype = None

        # self.lib.verify.argtypes = [
        #     POINTER(POINTER(c_ubyte)),
        #     c_size_t,
        #     POINTER(c_ubyte),
        # ]
        # self.lib.verify.restype = c_bool

    def make_root(self, leaves: List[bytes]) -> bytes:
        len_leaves = len(leaves)
        leaves_pointers = (POINTER(c_ubyte) * len_leaves)()

        for i, leaf in enumerate(leaves):
            array_type = c_ubyte * 32
            leaves_pointers[i] = array_type(*leaf)

        root_ptr = self.lib.make_root(leaves_pointers, len_leaves)
        root = bytes(root_ptr[:32])
        self.lib.free_root(root_ptr)
        return root

    def make_proof(self, leaves: List[bytes], leaf: bytes) -> bytes:
        leaf_pointer = (c_ubyte * 32)(*leaf)
        len_leaves = len(leaves)
        leaves_pointers = (POINTER(c_ubyte) * len_leaves)()

        for i, leaf in enumerate(leaves):
            array_type = c_ubyte * 32
            leaves_pointers[i] = array_type(*leaf)

        result_struct: MerkleProof = self.lib.make_proof(
            leaves_pointers, len_leaves, leaf_pointer
        )

        proof = []
        for i in range(result_struct.len):
            node_ptr = result_struct.ptr[i]
            node_data = bytes(node_ptr[:33])

            flag = node_data[32]
            data = node_data[:32]

            proof.append(Node(data=data, side=flag))

        self.lib.free_proof(result_struct.ptr, result_struct.len)
        return proof

    def verify(self, proof: List[Node], leaf: bytes) -> bytes:
        proof_bytes = []

        for node in proof:
            flag = node.side.value
            data = node.data
            proof_bytes.append([*data, flag])

        len_proof = len(proof_bytes)
        proof_pointers = (POINTER(c_ubyte) * len_proof)()

        for i, node in enumerate(proof_bytes):
            array_type = c_ubyte * 33
            proof_pointers[i] = array_type(*node)

        leaf_pointer = (c_ubyte * 32)(*leaf)

        return self.lib.verify(proof_pointers, len_proof, leaf_pointer)
