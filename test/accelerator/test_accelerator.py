from merkly.accelerator.mtreers import MTreers
from merkly.mtree import MerkleTree
from keccaky import hash_it_bytes
from merkly.node import Node
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


@mark.ffi
def test_merkle_proof_ffi(compile_rust_ffi):
    leaves_short = ["a", "b", "c", "d"]
    leaves_bytes = list(map(lambda x: hash_it_bytes(x.encode()), leaves_short))

    tree = MerkleTree(leaves_short)
    treers = MTreers()

    proof = tree.proof("a")
    result = treers.make_proof(leaves_bytes, leaves_bytes[0])
    assert proof == result
