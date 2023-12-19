"""
Testing Merkle Tree
"""

from merkly.accelerator.mtreers import MTreers
from merkly.mtree import MerkleTree
from Crypto.Hash import keccak


def hashing(data: str):
    keccak_256 = keccak.new(digest_bits=256)
    keccak_256.update(data.encode())
    return keccak_256.digest()


def test_merkle_root_rust():
    """
    Instantiated a simple Merkle Tree
    """
    leafs = list(map(hashing, ["a", "b", "c", "d"]))
    tree = MTreers()
    print("PYTHON")
    for x in leafs:
        print(x.hex())

    result = tree.make_root(leafs)
    assert result.hex() == "6b403b6dbdd79d6bb882036292bbe89a57e10defabd5c6718e66321c79b96abd", "Rust merkle root"


def test_merkle_root_python():
    """
    Instantiated a simple Merkle Tree
    """
    leafs = ["a", "b", "c", "d"]
    tree = MerkleTree(leafs)

    result = tree.make_root(leafs)
    assert (
        result[0]
        == "6b403b6dbdd79d6bb882036292bbe89a57e10defabd5c6718e66321c79b96abd"
    ), "Rust merkle root"
