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
    ["a", "b", "c"],
    ["a", "b", "c", "d", "e"],
    ["a", "b", "c", "d", "e", "f"],
    ["a", "b", "c", "d", "e", "f", "g"],
  ]
)
def test_error_simple_merkle_tree_constructor(x: List[str]):
  with raises(Exception):
    MerkleTree(x)