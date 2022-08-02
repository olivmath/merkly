from merkly.utils.crypto import keccak, slicer, merkle_root, merkle_proof
from pytest import mark
from typing import List

@mark.parametrize(
  "data, expect",
  [
    ("string very long", "2b91b0c651a9e25f0c3ca0278fe4ce8d5fae980731bc48f92fa192886d4dc4b6"),
    ("ethereum", "541111248b45b7a8dc3f5579f630e74cb01456ea6ac067d3f4d793245a255155"),
    ("bitcoin", "7dee6e1aa550de37364ec77e03e62ea56bf42037b8297280de9d844d88444e4d"),
    ("merkle", "326fe0d8a70ab934a7bf9d1323c6d87ee37bbe70079f82e72203b1e07c0c185c"),
    ("cars", "0ee92a51567d02169526115460f55ddef86e734b94b947896e82d4532671fdf2"),
    ("tree", "b2510336c6497719adadc7ade198c988520f3349445f074dc729df0f3c2b12ad"),
    ("a", "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb"),
    ("b", "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"),
    ("x", "7521d1cadbcfa91eec65aa16715b94ffc1c9654ba57ea2ef1a2127bca1127a83"),
    ("y", "83847cf31c36389df832d0d4d3df7cf28f211e3f83173e5c157bab31573d61f3")
  ]
)
def test_of_keccak(data: str, expect: bool):
  assert expect == keccak(data)


@mark.parametrize(
  "full, half",
  [
    ([i for i in range(2)], 1),
    ([i for i in range(7)], 4),
    ([i for i in range(10)], 5),
    ([i for i in range(112)], 56),
    ([i for i in range(200)], 100),
    ([i for i in range(900)], 450),
    ([i for i in range(1002)], 501),
    ([i for i in range(2040)], 1020),
    ([i for i in range(5008)], 2504),
    ([i for i in range(10010)], 5005)
  ]
)
def test_slicer(full: List[int], half: int):
  assert half == len(slicer(full))


@mark.parametrize(
  "leafs, root",
  [
    (["a", "b", "c", "d", "e", "f", "g", "h", "1","2","3","4","5","6","7","8"], "5703e6b7e7fc0c8f894f72dcc340cf4a0c8eb4bce10ba3e2ccf18ae9662e9997"),
    (["a", "b", "c", "d", "e", "f", "g", "h"], "5c48c83a8f7b41a9f73894006c97447b37bbdb535e59ebde364b57782f007925"),
    (["a", "b", "c", "d"], "6b403b6dbdd79d6bb882036292bbe89a57e10defabd5c6718e66321c79b96abd"),
    (["a", "b"], "67fad3bfa1e0321bd021ca805ce14876e50acac8ca8532eda8cbf924da565160"),
    (["a"], "a")
  ]
)
def test_create_root(leafs: List[str], root: str):
  assert merkle_root(leafs) == [root]


@mark.parametrize(
  "leafs, proof",
  [
    (
      ["a", "b", "c", "d"],
      [""]
    )
  ]
)
def test_merkle_proof(leafs: List[str], proof: List[str]):
  assert merkle_proof(leafs, leafs[0]) == 0