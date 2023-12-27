from merkly.utils import InvalidHashFunctionError
from merkly.mtree import MerkleTree
from pytest import raises


def test_make_proof_value_error():
    leafs = ["a", "b", "c", "d", "e", "f", "g", "h"]
    tree = MerkleTree(leafs)

    invalid_leaf = "invalid"
    with raises(ValueError) as error:
        tree.make_proof(leafs, [], invalid_leaf)

    assert (
        str(error.value) == f"Leaf: {invalid_leaf} does not exist in the tree: {leafs}"
    )


def test_invalid_hash_function_error():
    def invalid_hash_function(data):
        return 123

    with raises(InvalidHashFunctionError):
        MerkleTree(
            ["a", "b", "c", "d"],
            invalid_hash_function,
        )


def test_empty_tree_root():
    mtree = MerkleTree(['a', 'b', 'c', 'd'])
    mtree.leaves = []

    with raises(ValueError) as error:
        mtree.root

    assert str(error.value) == 'Cannot get root of an empty tree'
