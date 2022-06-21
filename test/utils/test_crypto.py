from cmath import exp
from merkly.utils.crypto import keccak
from pytest import mark

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




