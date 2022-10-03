"""
Crypto functions
"""

from merkly.utils.math import is_power_2
from merkly.mtree import Node
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
    return keccak_256(
        data.encode()
    ).hexdigest()


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

    return [
        list_item[i: i + 2]
        for i in range(0, len(list_item), 2)
    ]


def merkle_root(leafs: List[str]) -> str:
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

    if not is_power_2(len(leafs)):
        raise Exception(f"PARÔ, {len(leafs)}")

    if len(leafs) == 1:
        return leafs

    return merkle_root([
        keccak(i + j) for i, j in slice_in_pairs(leafs)
    ])


def merkle_proof(
    leafs: List[str],
    proof: List[str],
    leaf: str
) -> List[Node]:
    """
    # Make a proof
    - if the `leaf` index is less than half the size of the `leafs`
    list then the right side must reach root and vice versa
    """

    if len(leafs) == 2:
        proof.append(
            Node(right=leafs[1])
        )
        proof.append(
            Node(left=leafs[0])
        )
        return proof

    index = leafs.index(leaf)
    left, right = half(leafs)

    if index < len(leafs) / 2:
        proof.append(
            Node(right=merkle_root(right)[0])
        )
        return merkle_proof(left, proof, leaf)
    else:
        proof.append(
            Node(left=merkle_root(left)[0])
        )
        return merkle_proof(right, proof, leaf)
