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
            return f"{self.right[:3]}"
        elif self.right is None:
            return f"{self.left[:3]}"

class MerkleTree():
    """
    # 🌳 Merkle Tree
    - You can passa raw data
    - They will hashed by `keccak-256`
    """
    def __init__(self, leafs: List[str]) -> None:
        """
        # Constructor
        - Needs a `list` of `str` with length power of 2
        """
        from merkly.utils.math import is_power_2

        if not is_power_2(leafs.__len__()):
            raise Exception(
                "size of leafs should be power of 2\n" +
                "like: 2, 4, 8, 16, 32, 64, 128..."
            )
        # todo: to lazy initialize
        # todo: cache leafs
        self.leafs: List[str] = self.__hash_leafs(leafs)
        self.raw_leafs = leafs

    def __hash_leafs(self, leafs: List[str]) -> List[str]:
        """
        # hash leafs
        - hash each leaf
        """
        from merkly.utils.crypto import keccak

        return list(map(keccak, leafs))

    def __repr__(self) -> str:
        """
        # repr
        """
        return f"MerkleTree\n{self.raw_leafs}\n{self.short(self.leafs)}"

    def short(self, data: List[str]) -> List[str]:
        """
        # short any list of hash
        """
        return [x[:3] for x in data]

    @property
    def root(self) -> str:
        """
        # Get a root of merkle tree
        """
        from merkly.utils.crypto import merkle_root

        return merkle_root(self.leafs)[0]

    def proof(self, leaf: str) -> List[Node]:
        """
        # Get a proof of merkle tree
        """
        from merkly.utils.crypto import merkle_proof, keccak

        proof = merkle_proof(self.leafs, [], keccak(leaf))
        proof.reverse()
        return proof

    def verify(self, proof: List[str]) -> bool:
        """
        # Verify the Merkle Proof
        """
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
