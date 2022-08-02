"""
# Merkle Tree model
"""

from merkly.utils.crypto import merkle_root, merkle_proof, keccak
from merkly.utils.math import is_power_2
from typing import List

class MerkleTree():
    """
    # 🌳 Merkle Tree
    - You can passa raw data
    - They will hashed by `keccak-256`
    """
    def __init__(self, leafs: List[str]) -> None:
        """
        # Constructor
        - Needs a `list` of `str`
        """
        if not is_power_2(leafs.__len__()):
            raise Exception("size of leafs should be power of 2")

        self.leafs: List[str] = self.__hash_leafs(leafs)

    def __hash_leafs(self, leafs: List[str]) -> List[str]:
        return list(map(keccak, leafs))

    @property
    def root(self) -> str:
        """
        # Get a root of merkle tree
        """
        return merkle_root(self.leafs)

    def proof(self, leaf: str) -> List[str]:
        """
        # Get a proof of merkle tree
        """
        return merkle_proof(self.leafs, keccak(leaf))
