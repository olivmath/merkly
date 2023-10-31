import time
import pytest
from merkly.mtree import MerkleTree


def verify_proof_10_leaves():
    leafs = [str(i) for i in range(10)]
    tree = MerkleTree(leafs)
    proof = tree.proof("0")
    assert tree.verify(proof, "0")


def verify_proof_100_leaves():
    leafs = [str(i) for i in range(100)]
    tree = MerkleTree(leafs)
    proof = tree.proof("0")
    assert tree.verify(proof, "0")


def verify_proof_1000_leaves():
    leafs = [str(i) for i in range(1000)]
    tree = MerkleTree(leafs)
    proof = tree.proof("0")
    assert tree.verify(proof, "0")


@pytest.mark.benchmark(group="MerkleTreeVerify", timer=time.time)
def test_verify_proof_10_leaves(benchmark):
    benchmark(verify_proof_10_leaves)


@pytest.mark.benchmark(group="MerkleTreeVerify", timer=time.time)
def test_verify_proof_100_leaves(benchmark):
    benchmark(verify_proof_100_leaves)


@pytest.mark.benchmark(group="MerkleTreeVerify", timer=time.time)
def test_verify_proof_1000_leaves(benchmark):
    benchmark(verify_proof_1000_leaves)
