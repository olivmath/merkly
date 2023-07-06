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

    data: Optional[str] = None
    side: Side = Side.LEFT
