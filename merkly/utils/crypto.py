from typing import List


def keccak(data: str) -> str:
  """
  # Hash `data: str` using keccak256
  - params `data: str`
  - return `hexadecimal: str`

  ```python
  >>> keccak("merkle")
  "326fe0d8a70ab934a7bf9d1323c6d87ee37bbe70079f82e72203b1e07c0c185c"

  >>> keccak("tree")
  "b2510336c6497719adadc7ade198c988520f3349445f074dc729df0f3c2b12ad"

  >>> keccak("bitcoin")
  "7dee6e1aa550de37364ec77e03e62ea56bf42037b8297280de9d844d88444e4d"

  >>> keccak("ethereum")
  "541111248b45b7a8dc3f5579f630e74cb01456ea6ac067d3f4d793245a255155"
  ```
  """
  from sha3 import keccak_256

  return keccak_256(
    data.encode()
  ).hexdigest()


def slicer(x: list):
  """
  # Slice a `x: list[any]` in sublist of 2 items
  - params `x: list[any]`
  - return `list: list[list[any]]

  ```python
  >>> slicer([1,2,3,4])
  [[1, 2], [3, 4]]

  >>> slicer([i for i in range(10)])
  [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]
  ```
  """

  return [
    x[i: i + 2]
    for i in range(0, len(x), 2)
  ]


def merkle_root(x: List[str]) -> str:
  """
  # Merkle Root of `x: list[str]` using keccak256
  - params `x: lsit[str]`
  - return `hexadecimal: list[str]`

  ```python
  >>> merkle_root(["a", "b", "c", "d"])
  ["159b0d5005a27c97537ff0e6d1d0d619be408a5e3f2570816b02dc5a18b74f47"]

  >>> merkle_root(["a", "b"])
  ["63a9f18b64ca5a98ad9dba59259edb0710892614501480a9bed568d98450c151"]
  ```
  """
  from merkly.utils.math import is_power_2

  if not is_power_2(len(x)):
    raise Exception(f"PARÔ, {len(x)}")

  elif len(x) == 1:
    return [keccak(x[0])]

  else:
    return merkle_root([
      keccak(i + j) for i,j in slicer(x)
    ])
