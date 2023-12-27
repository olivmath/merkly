"""
Merkle Tree Model
"""

from typing import Callable, List
from functools import reduce

from merkly.node import Node, Side
from merkly.utils import (
    validate_hash_function,
    is_power_2,
    slice_in_pairs,
    keccak,
    half,
    validate_leafs,
)


class MerkleTree:
    """
    # 🌳 Merkle Tree implementation

    ## Args:
        - leaves: List of raw data
        - hash_function (Callable[[bytes, bytes], bytes], optional): Function that hashes the data.
            * Defaults to `keccak` if not provided
    """

    def __init__(
        self,
        leaves: List[str],
        hash_function: Callable[[bytes, bytes], bytes] = lambda x, y: keccak(x + y),
    ) -> None:
        validate_leafs(leaves)
        validate_hash_function(hash_function)
        self.hash_function: Callable[[bytes, bytes], bytes] = hash_function
        self.raw_leaves: List[str] = leaves
        self.leaves: List[str] = self.__hash_leaves(leaves)
        self.short_leaves: List[str] = self.short(self.leaves)

    def __hash_leaves(self, leaves: List[str]) -> List[str]:
        return list(map(lambda x: self.hash_function(x.encode(), bytes()), leaves))

    def __repr__(self) -> str:
        return f"""MerkleTree(\nraw_leaves: {self.raw_leaves}\nleaves: {self.leaves}\nshort_leaves: {self.short(self.leaves)})"""

    def short(self, data: List[str]) -> List[str]:
        return [x[:2] for x in data]

    @property
    def root(self) -> bytes:
        return self.make_root(self.leaves)

    def proof(self, raw_leaf: str) -> List[Node]:
        return self.make_proof(
            self.leaves, [], self.hash_function(raw_leaf.encode(), bytes())
        )

    def verify(self, proof: List[bytes], raw_leaf: str) -> bool:
        full_proof = [self.hash_function(raw_leaf.encode(), bytes())]
        full_proof.extend(proof)

        def concat_nodes(left: Node, right: Node) -> Node:
            if isinstance(left, Node) is not True:
                start_node = left
                if right.side == Side.RIGHT:
                    data = self.hash_function(start_node, right.data)
                    return Node(data=data, side=Side.LEFT)
                else:
                    data = self.hash_function(right.data, start_node)
                    return Node(data=data, side=Side.RIGHT)
            else:
                if right.side == Side.RIGHT:
                    data = self.hash_function(left.data, right.data)
                    return Node(data=data, side=Side.LEFT)
                else:
                    data = self.hash_function(right.data, left.data)
                    return Node(data=data, side=Side.RIGHT)

        return reduce(concat_nodes, full_proof).data == self.root

    def make_root(self, leaves: List[bytes]) -> bytes:
        if len(leaves) == 0:
            raise ValueError("Cannot get root of an empty tree")

        while len(leaves) > 1:
            next_level = []
            for i in range(0, len(leaves) - 1, 2):
                next_level.append(self.hash_function(leaves[i], leaves[i + 1]))

            if len(leaves) % 2 == 1:
                next_level.append(leaves[-1])

            leaves = next_level

        return leaves[0]

    def make_proof(
        self, leaves: List[bytes], proof: List[Node], leaf: bytes
    ) -> List[Node]:
        """
        # Make a proof

        ## Dev:
            - if the `leaf` index is less than half the size of the `leaves`
        list then the right side must reach root and vice versa

        ## Args:
            - leaves: List of leaves
            - proof: Accumulated proof
            - leaf: Leaf for which to create the proof

        ## Returns:
            - List of Nodes representing the proof
        """

        try:
            index = leaves.index(leaf)
        except ValueError as err:
            msg = f"Leaf: {leaf} does not exist in the tree: {leaves}"
            raise ValueError(msg) from err

        if is_power_2(len(leaves)) is False:
            return self.mix_tree(leaves, [], index)

        if len(leaves) == 2:
            if index == 1:
                proof.append(Node(data=leaves[0], side=Side.LEFT))
            else:
                proof.append(Node(data=leaves[1], side=Side.RIGHT))
            proof.reverse()
            return proof

        left, right = half(leaves)

        if index < len(leaves) / 2:
            proof.append(Node(data=self.make_root(right), side=Side.RIGHT))
            return self.make_proof(left, proof, leaf)
        else:
            proof.append(Node(data=self.make_root(left), side=Side.LEFT))
            return self.make_proof(right, proof, leaf)

    def mix_tree(
        self, leaves: List[bytes], proof: List[Node], leaf_index: int
    ) -> List[Node]:
        if len(leaves) == 1:
            return proof

        if leaf_index % 2 == 0:
            if leaf_index + 1 < len(leaves):
                node = Node(data=leaves[leaf_index + 1], side=Side.RIGHT)
                proof.append(node)
        else:
            node = Node(data=leaves[leaf_index - 1], side=Side.LEFT)
            proof.append(node)

        return self.mix_tree(self.up_layer(leaves), proof, leaf_index // 2)

    def up_layer(self, leaves: List[bytes]) -> List[bytes]:
        new_layer = []
        for pair in slice_in_pairs(leaves):
            if len(pair) == 1:
                new_layer.append(pair[0])
            else:
                data = self.hash_function(pair[0], pair[1])
                new_layer.append(data)
        return new_layer
