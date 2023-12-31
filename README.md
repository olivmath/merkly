<p align="center">
  <a href="https://pypi.org/project/merkly/">
    <img alt="Merkly" src="https://raw.githubusercontent.com/olivmath/merkly/main/assets/merkly-banner.png" width="1000">
  </a>
</p>

<p align="center">The simple and easy implementation of Python Merkle Tree.</p>

---

<p align="center">
    <a href="https://pypi.org/project/merkly/">
        <img src="https://img.shields.io/pypi/v/merkly">
    </a>
    <a href="https://github.com/olivmath/merkly/actions/workflows/ci.yml">
        <img src="https://github.com/olivmath/merkly/actions/workflows/ci.yml/badge.svg?branch=main">
    </a>
    <a href="https://pypi.org/project/merkly/">
        <img src="https://img.shields.io/pypi/pyversions/merkly">
    </a>
    <a href="https://pypi.org/project/merkly/">
        <img src="https://img.shields.io/pypi/dm/merkly">
    </a>
    <a href="https://github.com/olivmath/merkly/graphs/code-frequency">
    <img src="https://img.shields.io/github/commit-activity/m/olivmath/merkly">
    </a>
    <a href="https://github.com/olivmath/merkly/blob/main/LICENSE">
        <img src="https://img.shields.io/pypi/l/merkly">
    </a>
</p>

---

## Table of Contents

- [Credits](#credits)
- [Documentation](#Documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Credits

[![GitHub Contributors Image](https://contrib.rocks/image?repo=olivmath/merkly)](https://github.com/olivmath/merkly/graphs/contributors)

## Documentation

**HOW TO INSTALL**

```
poetry add merkly
```

```
pip install merkly
```

**HOW TO WORKS**

> **WARNING:** We use keccak-256 under-the-hood if you dont pass your hash function

This library provides a clean and easy to use implementation of the Merkle Tree with the following features:

- Create Leaf
- Create Root
- Create Proof
- Verify Proof

**HOW TO USE**

**Creating a Merkle Tree**

```python
from merkly.mtree import MerkleTree
from typing import Callable

# choose any hash function that is of type (bytes, bytes) -> bytes
my_hash_function: Callable[[bytes, bytes], bytes] = lambda x, y: x + y

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'], my_hash_function)

# show original input
assert mtree.raw_leaves == ['a', 'b', 'c', 'd']

# hashed leaves
assert mtree.leaves == [b'a', b'b', b'c', b'd']

# shorted hashed leaves
assert mtree.short_leaves == [b'a', b'b', b'c', b'd']
```

**Creating a Default Merkle Tree (with Keccak256)**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree with keccak256
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# show original input
assert mtree.raw_leaves == ['a', 'b', 'c', 'd']

# hashed leaves (just bytes)
assert mtree.leaves == [
    b':\xc2%\x16\x8d\xf5B\x12\xa2\\\x1c\x01\xfd5\xbe\xbf\xea@\x8f\xda\xc2\xe3\x1d\xddo\x80\xa4\xbb\xf9\xa5\xf1\xcb', b'\xb5U=\xe3\x15\xe0\xed\xf5\x04\xd9\x15\n\xf8-\xaf\xa5\xc4f\x7f\xa6\x18\xed\no\x19\xc6\x9bA\x16lU\x10', b'\x0bB\xb69<\x1fS\x06\x0f\xe3\xdd\xbf\xcdz\xad\xcc\xa8\x94FZZC\x8fi\xc8}y\x0b"\x99\xb9\xb2', b'\xf1\x91\x8e\x85b#n\xb1z\xdc\x85\x023/L\x9c\x82\xbc\x14\xe1\x9b\xfc\n\xa1\n\xb6t\xffu\xb3\xd2\xf3'
]

# shorted hashed leaves
assert mtree.short_leaves == [b':\xc2', b'\xb5U', b'\x0bB', b'\xf1\x91']


######## comming soon!

# human leaves
assert mtree.human_leaves == [
    "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    "f1918e8562236eb17adc8502332f4c9c82bc14e19bfc0aa10ab674ff75b3d2f3",
]
# shorted human hashed leaves
assert mtree.human_short_leaves = ["3ac2", "b555", "0b42", "f191"]
```

**Creating a Root**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get root of tree (This is compatible with MerkleTreeJS)
assert mtree.root.hex() == '68203f90e9d07dc5859259d7536e87a6ba9d345f2552b5b9de2999ddce9ce1bf'
```

**Creating Proof of a leaf**

```python
from merkly.mtree import MerkleTree
from merkly.node import Node, Side

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get proof of a `raw` leaf
assert mtree.proof('b') == [
    Node(data=b"3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb", side=Side.LEFT),
    Node(data=b"d253a52d4cb00de2895e85f2529e2976e6aaaa5c18106b68ab66813e14415669", side=Side.RIGHT)
]
```

**Checking the proof of a sheet**

```python
from merkly.mtree import MerkleTree
from merkly.node import Node, Side


# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get proof of a raw leaf
p = [
    Node(
        data=b"3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
        side=Side.LEFT
    ),
    Node(
        data=b"d253a52d4cb00de2895e85f2529e2976e6aaaa5c18106b68ab66813e14415669",
        side=Side.RIGHT
    )
]

# verify your proof of raw leaf
assert mtree.verify(p, 'b') == True
```

## Roadmap

| Feature                               | Status      | Version |
| ------------------------------------- | ----------- | ------- |
| Auto deploy PyPi                      | ✅ Deployed | 0.2.0   |
| Create Root                           | ✅ Deployed | 0.4.0   |
| Create Proof                          | ✅ Deployed | 0.5.0   |
| Verify Proof                          | ✅ Deployed | 0.6.0   |
| Use any Hash function                 | ✅ Deployed | 0.7.0   |
| Leafs of any size                     | ✅ Deployed | 0.8.0   |
| Security deprecation pysha3           | ✅ Deployed | 0.8.1   |
| Compatible with MerkleTreeJs          | ✅ Deployed | 1.0.0   |
| First Issue solved by community       | ✅ Deployed | 1.0.0   |
| Accelerator code with Rust            | 🏗️ Alpha    | 1.1.0   |
| Tutorial how to use with solidity     | 🖊️ Design   | x.x.x   |
| Tutorial how to use with MerkleTreeJS | 🖊️ Design   | x.x.x   |

## Contributing

- Before read a code of conduct: **[CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)**
- Follow the guide of development: **[CONTRIBUTING](CONTRIBUTING.md)**

## License

[MIT](LICENSE)
