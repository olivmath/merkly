"""
Testing Merkle Tree
"""

from merkly.utils import InvalidHashFunctionError
from merkly.mtree import MerkleTree, Node
from pytest import raises, mark
from typing import List


def test_simple_merkle_tree_constructor():
    """
    Instantiated a simple Merkle Tree
    """
    leafs = ["a", "b", "c", "d"]
    tree = MerkleTree(leafs)

    assert tree.leafs == [
        "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
        "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
        "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
        "f1918e8562236eb17adc8502332f4c9c82bc14e19bfc0aa10ab674ff75b3d2f3",
    ]


@mark.parametrize(
    "leafs",
    [
        ["a", "b", "c", "d", "e", "f", "g"],
        ["a", "b", "c", "d", "e", "f"],
        ["a", "b", "c", "d", "e"],
        ["a", "b", "c"],
    ],
)
def test_error_simple_merkle_tree_constructor(leafs: List[str]):
    """
    Instantiated a wrong Merkle Tree
    """
    with raises(Exception):
        MerkleTree(leafs)


@mark.parametrize(
    "leafs, root",
    [
        (
            ["a", "b", "c", "d", "e", "f", "g", "h"],
            "2dfe93948ecb1a0903dbf034de56d6529e62679519a37ed3b5b3356ab27b7bb8",
        ),
        (
            ["a", "b", "c", "d"],
            "115cbb4775ed495f3d954dfa47164359a97762b40059d9502895def16eed609c",
        ),
        (
            ["a", "b"],
            "414e3a845393ef6d68973ddbf5bd85ff524443cf0e06a361624f3d51b879ec1c",
        ),
        (["a"], "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb"),
    ],
)
def test_simple_merkle_root(leafs: List[str], root: str):
    """
    Generate a Root of a simple Merkle Tree
    """
    tree = MerkleTree(leafs)
    assert tree.root == root


def test_proof_simple_merkle():
    """
    Instantiated a simple Merkle Tree
    """
    leafs = ["a", "b", "c", "d"]
    tree = MerkleTree(leafs)

    assert tree.proof("a") == [
        Node(right="b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"),
        Node(right="64673cf40035df6d3a0d0143cc8426de49b9a93b9ad2d330cb4f0bc390a86d20"),
    ]


@mark.parametrize(
    "leaf",
    ["a", "b", "c", "d", "e", "f", "g", "h", "1", "2", "3", "4", "5", "6", "7", "8"],
)
def test_verify_simple_merkle(leaf: str):
    """
    Instantiated a simple Merkle Tree
    """
    tree = MerkleTree(
        ["a", "b", "c", "d", "e", "f", "g", "h", "1", "2", "3", "4", "5", "6", "7", "8"]
    )

    assert tree.verify(tree.proof(leaf), leaf)


@mark.parametrize(
    "left, right, expected",
    [
        (None, "efgh", "Node(right: efgh...)"),
        ("abcd", None, "Node(left: abcd...)"),
        ("abcd", "efgh", ""),
    ],
)
def test_node_repr(left, right, expected):
    """
    Tests the __repr__ method of Node class.
    """
    node = Node(left=left, right=right)
    assert repr(node) == expected


def test_make_proof_value_error():
    """
    Testa a captura de ValueError na função make_proof
    """
    leafs = ["a", "b", "c", "d", "e", "f", "g", "h"]
    tree = MerkleTree(leafs)

    invalid_leaf = "invalid"
    with raises(ValueError) as error:
        tree.make_proof(leafs, [], invalid_leaf)

    assert (
        str(error.value) == f"Leaf: {invalid_leaf} does not exist in the tree: {leafs}"
    )


def test_merkle_tree_repr():
    """
    Testa a representação em string (__repr__) da classe MerkleTree
    """
    leafs = ["a", "b", "c", "d", "e", "f", "g", "h"]
    tree = MerkleTree(leafs, lambda x: f"{x}1")

    expected_repr = """MerkleTree(\nraw_leafs: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']\nleafs: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']\nshort_leafs: ['a1...', 'b1...', 'c1...', 'd1...', 'e1...', 'f1...', 'g1...', 'h1...'])"""

    assert repr(tree) == expected_repr


def test_invalid_hash_function_error():
    def invalid_hash_function_that_returns_an_integer_instead_of_a_string(data):
        return 123

    with raises(InvalidHashFunctionError):
        MerkleTree(["a", "b", "c", "d"], invalid_hash_function_that_returns_an_integer_instead_of_a_string)
