"""
Crypto functions
"""

from typing import List, Tuple
from sha3 import keccak_256


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
    return keccak_256(data.encode()).hexdigest()


def half(list_item: List[int]) -> Tuple[int, int]:
    """
    # Slice a `x: list[int]` in a pairs
    - params `x: list[int]`
    - return `list: list[list[int]]

    ```python
    >>> slicer([1,2,3,4])
    [[1, 2], [3, 4]]

    >>> slicer([i for i in range(10)])
    [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]]
    ```
    """

    length = len(list_item) // 2

    return (list_item[:length], list_item[length:])


def slice_in_pairs(list_item: list):
    """
    # Slice a `x: list[int]` in pairs, pairs is sublist of 2 items
    - params `x: list[int]`
    - return `list: list[list[int]]

    ```python
    >>> slicer([1,2,3,4])
    [[1, 2], [3, 4]]

    >>> slicer([i for i in range(10)])
    [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]
    ```
    """

    return [list_item[i : i + 2] for i in range(0, len(list_item), 2)]
