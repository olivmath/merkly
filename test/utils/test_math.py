from merkly.utils import PowerOfTwoError, is_power_2
from pytest import mark, raises


@mark.parametrize(
    "number, ok",
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
        (65536, True),
    ],
)
def test_of_is_power_2(number: int, ok: bool):
    if ok:
        assert ok == is_power_2(number)
    else:
        with raises(PowerOfTwoError):
            is_power_2(number)
