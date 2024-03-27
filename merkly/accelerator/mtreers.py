from Crypto.Hash import keccak as cryptodome_keccak
from typing import List
from ctypes import (
    CDLL,
    CFUNCTYPE,
    c_ubyte,
    c_size_t,
    POINTER,
    cast,
    memmove,
)


class MTreers:
    def __init__(self) -> None:
        ...

    def make_root(self, leaves: List[bytes]) -> bytes:
        ...

    def make_proof(self, leaves: List[bytes]) -> bytes:
        ...

    def verify(self, proof: List[bytes], raw_leaf: str) -> bytes
        ...