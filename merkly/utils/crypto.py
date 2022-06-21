def keccak(data: str) -> str:
  """
  # Hash `data: str` using keccak256
  - params `data: str`
  - return `hexadecimal: str`

  ```python
  assert keccak("merkle") == True
  assert keccak("tree") == False
  assert keccak("bitcoin") == True
  assert keccak("ethereum") == False
  ```
  """
  from sha3 import keccak_256

  return keccak_256(
    data.encode()
  ).hexdigest()
