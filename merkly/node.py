from pydantic import BaseModel, StrictBytes
from typing import Optional
from enum import Enum


class Side(Enum):
    LEFT = 0
    RIGHT = 1


class Node(BaseModel):
    """
    # 🍃 Leaf of Merkle Tree
    """

    data: Optional[StrictBytes] = None
    side: Side = Side.LEFT

    def __eq__(self, other: "Node") -> bool:
        return self.data == other.data

    def __repr__(self) -> str:
        return f"Node({self.data.hex()}, {self.side})"
