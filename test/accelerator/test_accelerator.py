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
    assert proof == [
        Node(
            data=bytes.fromhex(
                "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"
            ),
            side=1,
        ),
        Node(
            data=bytes.fromhex(
                "d253a52d4cb00de2895e85f2529e2976e6aaaa5c18106b68ab66813e14415669"
            ),
            side=1,
        ),
    ]
    assert result == []
