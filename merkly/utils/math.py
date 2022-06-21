def is_power_2(x: int) -> bool:
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

  a: bool = (x & (x - 1) == 0)
  b: bool = x != 0
  return a and b
