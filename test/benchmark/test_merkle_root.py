from merkly.mtree import MerkleTree
import pytest
import time


def create_merkle_tree_root_10_leaves():
    leafs = [str(i) for i in range(10)]
    tree = MerkleTree(leafs)
    result = "f8b45f3031274577651c6d43e7ec3f7361e82b2295e24a9b369693354d3a2db8"
    assert tree.root == result


def create_merkle_tree_root_100_leaves():
    leafs = [str(i) for i in range(100)]
    tree = MerkleTree(leafs)
    result = "8e92f7efa075e532b920ef39adb04a0147ac84d99315584dbd2a1cb868019c35"
    assert tree.root == result


def create_merkle_tree_root_1000_leaves():
    leafs = [str(i) for i in range(1000)]
    tree = MerkleTree(leafs)
    result = "e66024476f6ef8f431f07dca6ea0d10dd904dda4b47488a49e75f8671ba733ee"
    assert tree.root == result


@pytest.mark.benchmark(group="MerkleTreeRoot", timer=time.time)
def test_create_merkle_tree_root_10_leaves(benchmark):
    benchmark(create_merkle_tree_root_10_leaves)


@pytest.mark.benchmark(group="MerkleTreeRoot", timer=time.time)
def test_create_merkle_tree_root_100_leaves(benchmark):
    benchmark(create_merkle_tree_root_100_leaves)


@pytest.mark.benchmark(group="MerkleTreeRoot", timer=time.time)
def test_create_merkle_tree_root_1000_leaves(benchmark):
    benchmark(create_merkle_tree_root_1000_leaves)
