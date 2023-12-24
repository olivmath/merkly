from merkly.mtree import MerkleTree
import pytest
import time


def create_merkle_tree_root_10_leaves():
    leafs = [str(i) for i in range(10)]
    tree = MerkleTree(leafs)
    result = "2a3eb5e4fd7ca38eebd660d4b9879fd3e235cd240772bccdfadfa6c1529b4711"
    assert tree.root.hex() == result


def create_merkle_tree_root_100_leaves():
    leafs = [str(i) for i in range(100)]
    tree = MerkleTree(leafs)
    result = "b46bf20bce2aafc0abe89f56509648c98fbad9f969d12869b40b4472845e2318"
    assert tree.root.hex() == result


def create_merkle_tree_root_1000_leaves():
    leafs = [str(i) for i in range(1000)]
    tree = MerkleTree(leafs)
    result = "fc0bdf832532d9d94510c8643720f63f22db9996f07965e1d1da9fb0d3fd7144"
    assert tree.root.hex() == result


@pytest.mark.benchmark(group="MerkleTreeRoot", timer=time.time)
def test_create_merkle_tree_root_10_leaves(benchmark):
    benchmark(create_merkle_tree_root_10_leaves)


@pytest.mark.benchmark(group="MerkleTreeRoot", timer=time.time)
def test_create_merkle_tree_root_100_leaves(benchmark):
    benchmark(create_merkle_tree_root_100_leaves)


@pytest.mark.benchmark(group="MerkleTreeRoot", timer=time.time)
def test_create_merkle_tree_root_1000_leaves(benchmark):
    benchmark(create_merkle_tree_root_1000_leaves)
