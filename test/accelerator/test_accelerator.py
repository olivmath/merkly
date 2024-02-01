from merkly.accelerator.mtreers import MTreers
from merkly.mtree import MerkleTree
from keccaky import hash_it_bytes
from pytest import mark


@mark.ffi
def test_merkle_root_ffi(compile_rust_ffi):
    leaves_short = ["a", "b", "c", "d"]
    leaves_bytes = list(map(lambda x: hash_it_bytes(x.encode()), leaves_short))

    tree = MerkleTree(leaves_short)
    treers = MTreers()


    root = tree.root
    result = treers.make_root(leaves_bytes)

    assert list(root) == list(result)
