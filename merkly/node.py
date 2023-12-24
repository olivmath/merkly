from enum import Enum
from typing import Optional
from pydantic import BaseModel


class Side(Enum):
    LEFT = 0
    RIGHT = 1


class Node(BaseModel):
    """
    # 🍃 Leaf of Merkle Tree
    """

    data: Optional[bytes] = None
    side: Side = Side.LEFT

    def __eq__(self, other: "Node") -> bool:
        return self.data == other.data

    def __repr__(self) -> str:
        return f"Node({self.data.hex()}, {self.side})"
