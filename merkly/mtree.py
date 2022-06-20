from typing import List
from hashlib import sha3_256 as sha


class MerkleTree(object):
  """
  # Merkle Tree
  - You can passa raw data
  - They will hashed by `sha3-256`
  """
  def __init__(self, leafs: List[str]) -> None:
    self.leafs: List[str] = self.__hash_leafs(leafs)

  def __hash_leafs(self, leafs: List[str]) -> List[str]:
    def hash(data: str) -> str:
      h = sha()
      h.update(data.encode())
      return h.hexdigest()

    return list(
      map(hash, leafs)
    )
