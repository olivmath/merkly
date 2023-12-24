from merkly.mtree import MerkleTree
import pytest
import time


def create_proof_10_leaves():
    leafs = [str(i) for i in range(10)]
    tree = MerkleTree(leafs)
    proof = tree.proof("5")
    assert len(proof) == 4


def create_proof_100_leaves():
    leafs = [str(i) for i in range(100)]
    tree = MerkleTree(leafs)
    proof = tree.proof("50")
    assert len(proof) == 7


def create_proof_1000_leaves():
    leafs = [str(i) for i in range(1000)]
    tree = MerkleTree(leafs)
    proof = tree.proof("500")
    assert len(proof) == 10


@pytest.mark.benchmark(group="MerkleTreeProof", timer=time.time)
def test_create_proof_10_leaves(benchmark):
    benchmark(create_proof_10_leaves)


@pytest.mark.benchmark(group="MerkleTreeProof", timer=time.time)
def test_create_proof_100_leaves(benchmark):
    benchmark(create_proof_100_leaves)


@pytest.mark.benchmark(group="MerkleTreeProof", timer=time.time)
def test_create_proof_1000_leaves(benchmark):
    benchmark(create_proof_1000_leaves)
