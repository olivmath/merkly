"""
Merkle Tree Model
"""

from typing import Callable, List
from functools import reduce

from merkly.node import Node, Side
from merkly.utils import (
    hash_function_type_checking,
    slice_in_pairs,
    keccak,
    half,
)


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
        hash_function_type_checking(hash_function)
        self.hash_function: Callable[[str], str] = hash_function
        self.raw_leafs: List[str] = leafs
        self.leafs: List[str] = self.__hash_leafs(leafs)
        self.short_leafs: List[str] = self.short(self.leafs)

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
        return self.make_proof(self.leafs, [], self.hash_function(raw_leaf, ""))

    def verify(self, proof: List[str], raw_leaf: str) -> bool:
        full_proof = [self.hash_function(raw_leaf)]
        full_proof.extend(proof)

        def concat_nodes(left: Node, right: Node) -> Node:
            if isinstance(left, Node) is not True:
                start_node = left
                if right.side == Side.RIGHT:
                    data = self.hash_function(start_node + right.data)
                    return Node(data=data, side=Side.LEFT)
                else:
                    data = self.hash_function(right.data + start_node)
                    return Node(data=data, side=Side.RIGHT)
            else:
                if right.side == Side.RIGHT:
                    data = self.hash_function(left.data + right.data)
                    return Node(data=data, side=Side.LEFT)
                else:
                    data = self.hash_function(right.data + left.data)
                    return Node(data=data, side=Side.RIGHT)

        return reduce(concat_nodes, full_proof).data == self.root

    def make_root(self, leafs: List[str]) -> List[str]:
        if len(leafs) == 1:
            return leafs

        return self.make_root(
            [
                self.hash_function(pair[0] + pair[1]) if len(pair) > 1 else pair[0]
                for pair in slice_in_pairs(leafs)
            ]
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
                proof.append(Node(data=leafs[0], side=Side.LEFT))
            else:
                proof.append(Node(data=leafs[1], side=Side.RIGHT))
            proof.reverse()
            return proof

        left, right = half(leafs)

        if index < len(leafs) / 2:
            proof.append(Node(data=self.make_root(right)[0], side=Side.RIGHT))
            return self.make_proof(left, proof, leaf)
        else:
            proof.append(Node(data=self.make_root(left)[0], side=Side.LEFT))
            return self.make_proof(right, proof, leaf)
