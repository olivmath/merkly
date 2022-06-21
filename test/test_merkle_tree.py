from merkly.mtree import MerkleTree
from pytest import raises, mark
from typing import List


def test_simple_merkle_tree_constructor():
  x = ["a", "b", "c", "d"]
  tree = MerkleTree(x)

  assert tree.leafs == [
    '3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb',
    'b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510',
    '0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2',
    'f1918e8562236eb17adc8502332f4c9c82bc14e19bfc0aa10ab674ff75b3d2f3',
  ]


@mark.parametrize(
  "x",
  [
    ["a", "b", "c", "d", "e", "f", "g"],
    ["a", "b", "c", "d", "e", "f"],
    ["a", "b", "c", "d", "e"],
    ["a", "b", "c"]
  ]
)
def test_error_simple_merkle_tree_constructor(x: List[str]):
  with raises(Exception):
    MerkleTree(x)


@mark.parametrize(
  "x, root",
  [
    (["a", "b", "c", "d", "e", "f", "g", "h"], "724655eedd83ac8b58d2d090f21a34755e5da82713332645e7db67aec88740ba"),
    (["a", "b", "c", "d"], "f90854ce2337f197c3b0f047cecaae7d5bad1095ceb9c70070ca7793941efe4b"),
    (["a", "b"], "e3b534d49837a4f8a2f95d5b71829e55a1708289654abbbf79c6441867555616")
  ]
)
def test_simple_merkle_root(x: List[str], root: str):
  tree = MerkleTree(x)
  assert tree.root == root
