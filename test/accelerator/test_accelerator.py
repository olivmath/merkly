"""
Testing Merkle Tree
"""

from merkly.accelerator.mtreers import MTreers
from merkly.mtree import MerkleTree
from Crypto.Hash import keccak


def hashing(x: bytes, y: bytes = bytes()) -> bytes:
    data: bytes = x + y
    keccak_256 = keccak.new(digest_bits=256)
    keccak_256.update(data)
    return keccak_256.digest()


def test_merkle_root_rust_and_merkle_root_python():
    """
    Instantiated a simple Merkle Tree
    """
    leafs = ["a", "b", "c", "d"]
    tree = MerkleTree(leafs)
    treers = MTreers()

    bytes_leaves = list(map(lambda x: x.encode(), leafs))
    hash_leaves = list(map(hashing, bytes_leaves))

    print(tree.human_leaves)
    treers.make_root(hash_leaves)

    assert 1 == 2
