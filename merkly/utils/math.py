"""
Math utils functions
"""

def is_power_2(number: int) -> bool:
    """
    # Verify if `x: int` is power of 2
    - params `x: int`
    - return `bool`

    ```python
    assert is_power_2(2) == True
    assert is_power_2(3) == False
    assert is_power_2(16) == True
    assert is_power_2(900) == False
    ```
    """

    left: bool = (number & (number - 1) == 0)
    right: bool = number != 0
    return left and right
