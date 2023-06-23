from merkly.utils import slice_in_pairs
from pytest import mark
from typing import List



@mark.parametrize(
    "full, half",
    [
        ([i for i in range(2)], 1),
        ([i for i in range(7)], 4),
        ([i for i in range(10)], 5),
        ([i for i in range(112)], 56),
        ([i for i in range(200)], 100),
        ([i for i in range(900)], 450),
        ([i for i in range(1002)], 501),
        ([i for i in range(2040)], 1020),
        ([i for i in range(5008)], 2504),
        ([i for i in range(10010)], 5005),
    ],
)
def test_slice_in_pairs(full: List[int], half: int):
    assert half == len(slice_in_pairs(full))
