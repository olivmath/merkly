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

<div style="background-color: yellow; padding: 10px; border-left: 6px solid red;">
  <strong>Atenção!</strong> Este é um alerta importante.
</div>

> **Nota:** Este é um alerta ou nota importante.

!!! warning "Atenção"
Este é um alerta importante.

- `We use keccak-256 under-the-hood if you dont pass your hash function`

This library provides a clean and easy to use implementation of the Merkle Tree with the following features:

- Create Leaf
- Create Root
- Create Proof
- Verify Proof

**HOW TO USE**

**Create a Merkle Tree**

```python
from merkly.mtree import MerkleTree
from typing import Callable

# choose any hash function that is of type (str) -> str
my_hash_function: Callable[[str], str] = lambda data: str(ord(data) * 1000)

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'], my_hash_function)

# show original input
assert mtree.raw_leafs == ['a', 'b', 'c', 'd']

# hashed leafs
assert mtree.leafs == ['97000', '98000', '99000', '100000']

# shorted hashed leafs
assert mtree.short_leafs == ['9700...', '9800...', '9900...', '1000...']
```

**Create a Merkle Tree (Default: Keccak256)**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree with keccak256
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# show original input
assert mtree.raw_leafs == ['a', 'b', 'c', 'd']

# hashed leafs
assert mtree.leafs == [
    '3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb',
    'b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510',
    '0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2',
    'f1918e8562236eb17adc8502332f4c9c82bc14e19bfc0aa10ab674ff75b3d2f3'
]

# shorted hashed leafs
assert mtree.short_leafs == [
    '3ac2...',
    'b555...',
    '0b42...',
    'f191...'
]
```

**Create a Root**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get root of tree
assert mtree.root == '115cbb4775ed495f3d954dfa47164359a97762b40059d9502895def16eed609c'
```

**Create Proof of a leaf**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get proof of a `raw` leaf
assert mtree.proof('b') == [
    Node(left: '3ac2...'),
    Node(right: 'b555...'),
    Node(right: '6467...')
]
```

**Verify Proof of a leaf**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get proof of a raw leaf
p = mtree.proof('b')

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

<!-- https://math.mit.edu/research/highschool/primes/materials/2018/Kuszmaul.pdf -->
