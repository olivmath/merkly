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


def get_data_from_api():
    leaves = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
    ]
    tree = MerkleTree(leaves)

    leaf = "1"
    proof = tree.proof(leaf)
    return proof, leaf


def test_verify_merkle_proof_without_leaves():
    proof, leaf = get_data_from_api()

    root = "3aa22c94ceb510827b04fa792ebdd7346eb2984ebb24e58dac66d7795c2af4e8"

    # Test valid proof
    result = MerkleTree.verify_proof(proof, leaf, root)
    assert result, "Expected proof to be valid"

    # Test invalid proof scenario
    invalid_leaf = "invalid_leaf_data"
    invalid_result = MerkleTree.verify_proof(proof, invalid_leaf, root)
    assert not invalid_result, "Expected proof to be invalid for incorrect leaf"

    # Test with a different root
    different_root = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    different_result = MerkleTree.verify_proof(proof, leaf, different_root)
    assert not different_result, "Expected proof to be invalid for different root"
