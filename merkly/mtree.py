"""
Merkle Tree Model
"""

from typing import Callable, List, Optional
from pydantic import BaseModel
from functools import reduce

from merkly.utils import is_power_2
from merkly.utils import (
    hash_function_type_checking,
    slice_in_pairs,
    keccak,
    half,
)


class Node(BaseModel):
    """
    # 🍃 Leaf of Merkle Tree

    ## Args:
        - left (Optional[str]): Left child node hash.
        - right (Optional[str]): Right child node hash.
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
    # 🌳 Merkle Tree implementation

    ## Args:
        - leafs: List of raw data
        - hash_function (Callable[[str], str], optional): Function that hashes the data.
            * Defaults to `keccak` if not provided. It must have the signature (data: str) -> str.

    """

    def __init__(
        self, leafs: List[str], hash_function: Callable[[str], str] = keccak
    ) -> None:
        is_power_2(len(leafs))
        hash_function_type_checking(hash_function)
        self.hash_function: Callable[[str], str] = hash_function
        self.raw_leafs: List[str] = leafs
        self.leafs: List[str] = self.__hash_leafs(leafs)
        self.short_leafs: List[str] = self.short(leafs)

    def __hash_leafs(self, leafs: List[str]) -> List[str]:
        return list(map(self.hash_function, leafs))

    def __repr__(self) -> str:
        return f"""MerkleTree(\nraw_leafs: {self.raw_leafs}\nleafs: {self.leafs}\nshort_leafs: {self.short(self.leafs)})"""

    def short(self, data: List[str]) -> List[str]:
        return [f"{x[:4]}..." for x in data]

    @property
    def root(self) -> str:
        return self.make_root(self.leafs)[0]

    def proof(self, raw_leaf: str) -> List[Node]:
        proof = self.make_proof(self.leafs, [], self.hash_function(raw_leaf))
        proof.reverse()
        return proof

    def verify(self, proof: List[str], raw_leaf: str) -> bool:
        full_proof = [self.hash_function(raw_leaf)]
        full_proof.extend(proof)

        def _f(_x: Node, _y: Node) -> Node:
            if not isinstance(_x, Node):
                if _y.left is not None:
                    return Node(left=self.hash_function(_y.left + _x))
                else:
                    return Node(left=self.hash_function(_x + _y.right))
            if _x.left is not None and _y.left is not None:
                return Node(left=self.hash_function(_y.left + _x.left))
            if _x.right is not None and _y.right is not None:
                return Node(right=self.hash_function(_x.right + _y.right))

            if _x.right is not None:
                return Node(right=self.hash_function(_y.left + _x.right))
            if _x.left is not None:
                return Node(left=self.hash_function(_x.left + _y.right))

        return reduce(_f, full_proof).left == self.root

    def make_root(self, leafs: List[str]) -> List[str]:
        if len(leafs) == 1:
            return leafs

        return self.make_root(
            [self.hash_function(i + j) for i, j in slice_in_pairs(leafs)]
        )

    def make_proof(self, leafs: List[str], proof: List[Node], leaf: str) -> List[Node]:
        """
        # Make a proof

        ## Dev:
            - if the `leaf` index is less than half the size of the `leafs`
        list then the right side must reach root and vice versa

        ## Args:
            - leafs: List of leafs
            - proof: Accumulated proof
            - leaf: Leaf for which to create the proof

        ## Returns:
            - List of Nodes representing the proof
        """

        try:
            index = leafs.index(leaf)
        except ValueError as err:
            msg = f"Leaf: {leaf} does not exist in the tree: {leafs}"
            raise ValueError(msg) from err

        if len(leafs) == 2:
            if index == 1:
                proof.append(Node(left=leafs[0]))
            else:
                proof.append(Node(right=leafs[1]))
            return proof

        left, right = half(leafs)

        if index < len(leafs) / 2:
            proof.append(Node(right=self.make_root(right)[0]))
            return self.make_proof(left, proof, leaf)
        else:
            proof.append(Node(left=self.make_root(left)[0]))
            return self.make_proof(right, proof, leaf)
