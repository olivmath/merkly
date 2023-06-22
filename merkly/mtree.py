"""
# Merkle Tree model
"""
from typing import List, Optional
from pydantic import BaseModel


class Node(BaseModel):
    """
    # 🍃 Leaf of Tree
    """

    left: Optional[str]
    right: Optional[str]

    def __repr__(self) -> str:
        if self.left is None:
            return f"Node(right: {self.right[:4]}...)"
        elif self.right is None:
            return f"Node(left: {self.left[:4]}...)"
        else:
            return ""


class MerkleTree:
    """
    # 🌳 Merkle Tree
    - You can pass a list of raw data
    - They will hashed by `keccak-256`
    """

    def __init__(self, leafs: List[str]) -> None:
        from merkly.utils.math import is_power_2

        if not is_power_2(leafs.__len__()):
            # todo: custom error
            raise Exception(
                "size of leafs should be power of 2\n"
                + "like: 2, 4, 8, 16, 32, 64, 128..."
            )
        self.leafs: List[str] = self.__hash_leafs(leafs)
        self.raw_leafs = leafs

    def __hash_leafs(self, leafs: List[str]) -> List[str]:
        from merkly.utils.crypto import keccak

        return list(map(keccak, leafs))

    def __repr__(self) -> str:
        return f"""MerkleTree(
            leafs_raw: {self.raw_leafs}
            leafs_hashed: {self.short(self.leafs)}
            leafs_hashed_shorted: {self.short(self.leafs)}
        )"""

    def short(self, data: List[str]) -> List[str]:
        return [f'{x[:4]}...' for x in data]

    @property
    def root(self) -> str:
        return MerkleTree.merkle_root(self.leafs)[0]

    def proof(self, leaf: str) -> List[Node]:
        from merkly.utils.crypto import keccak

        proof = MerkleTree.merkle_proof(self.leafs, [], keccak(leaf))
        proof.reverse()
        return proof

    def verify(self, proof: List[str]) -> bool:
        from merkly.utils.crypto import keccak
        from functools import reduce

        def _f(_x: Node, _y: Node) -> Node:
            """
            # f(x,y) -> Node
            """
            if _x.left is not None and _y.left is not None:
                return Node(left=keccak(_y.left + _x.left))
            if _x.right is not None and _y.right is not None:
                return Node(right=keccak(_x.right + _y.right))

            if _x.right is not None:
                return Node(right=keccak(_y.left + _x.right))
            if _x.left is not None:
                return Node(left=keccak(_x.left + _y.right))

        return reduce(_f, proof).left == self.root

    @staticmethod
    def merkle_root(leafs: list):
        """
        # Merkle Root of `x: list[str]` using keccak256
        - params `x: list[str]`
        - return `hexadecimal: list[str]`

        ```python
        >>> merkle_root(["a", "b", "c", "d"])
        ["159b0d5005a27c97537ff0e6d1d0d619be408a5e3f2570816b02dc5a18b74f47"]

        >>> merkle_root(["a", "b"])
        ["414e3a845393ef6d68973ddbf5bd85ff524443cf0e06a361624f3d51b879ec1c"]
        ```
        """
        from merkly.utils.math import is_power_2
        from merkly.utils.crypto import keccak, slice_in_pairs

        if not is_power_2(len(leafs)):
            raise Exception(f"PARÔ, {len(leafs)}")

        if len(leafs) == 1:
            return leafs

        return MerkleTree.merkle_root([keccak(i + j) for i, j in slice_in_pairs(leafs)])

    @staticmethod
    def merkle_proof(leafs: List[str], proof: List[str], leaf: str) -> list:
        """
        # Make a proof
        - if the `leaf` index is less than half the size of the `leafs`
        list then the right side must reach root and vice versa
        """
        from merkly.utils.crypto import half

        if len(leafs) == 2:
            proof.append(Node(right=leafs[1]))
            proof.append(Node(left=leafs[0]))
            return proof

        try:
            index = leafs.index(leaf)
        except ValueError as err:
            raise ValueError(
                f"leaf: {leaf} does not exist in the tree: {leafs}"
            ) from err

        left, right = half(leafs)

        if index < len(leafs) / 2:
            proof.append(Node(right=MerkleTree.merkle_root(right)[0]))
            return MerkleTree.merkle_proof(left, proof, leaf)
        else:
            proof.append(Node(left=MerkleTree.merkle_root(left)[0]))
            return MerkleTree.merkle_proof(right, proof, leaf)
