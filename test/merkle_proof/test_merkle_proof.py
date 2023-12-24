from pytest import mark
from merkly.mtree import MerkleTree
from merkly.node import Node, Side


def test_proof_simple_odd_merkle():
    leafs = ["a", "b", "c", "d", "e"]
    tree = MerkleTree(leafs, lambda x, y: x + y)
    proof = [
        Node(data=b"abcd", side=Side.LEFT),
    ]

    result = tree.proof("e")
    assert result == proof


def test_proof_simple_merkle():
    leafs = ["a", "b", "c", "d"]
    tree = MerkleTree(leafs)
    proof = [
        Node(
            side=Side.RIGHT,
            data=bytes.fromhex(
                "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"
            ),
        ),
        Node(
            side=Side.RIGHT,
            data=bytes.fromhex(
                "d253a52d4cb00de2895e85f2529e2976e6aaaa5c18106b68ab66813e14415669"
            ),
        ),
    ]

    result = tree.proof("a")
    assert result == proof


@mark.parametrize(
    "leaf",
    ["a", "b", "c", "d", "e", "f", "g", "h", "1", "2", "3", "4", "5", "6", "7", "8"],
)
def test_verify_merkle(leaf: str):
    tree = MerkleTree(
        ["a", "b", "c", "d", "e", "f", "g", "h", "1", "2", "3", "4", "5", "6", "7", "8"]
    )

    result = tree.proof(leaf)
    assert tree.verify(result, leaf)
