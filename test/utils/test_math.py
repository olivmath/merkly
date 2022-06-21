from cmath import exp
from merkly.utils.math import is_power_2
from pytest import mark

@mark.parametrize(
  "number, expect",
  [
    (3, False),
    (13, False),
    (345, False),
    (3098, False),
    (31234, False),
    (2, True),
    (4, True),
    (64, True),
    (4096, True),
    (65536, True)
  ]
)
def test_of_is_power_2(number: int, expect: bool):
  assert expect == is_power_2(number)




