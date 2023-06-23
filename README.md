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
- [How to install](#how-to-install)
- [How it works](#how-it-works)
- [How to use](#how-to-use)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Credits

[![GitHub Contributors Image](https://contrib.rocks/image?repo=olivmath/merkly)](https://github.com/olivmath/merkly/graphs/contributors)

## How to install

```
poetry add merkly
```

```
pip install merkly
```

## How to works

- _We use keccak-256 under-the-hood_

This library provides a clean and easy to use implementation of the Merkle Tree with the following features:

- Create Leaf
- Create Root
- Create Proof
- Verify Proof

## How to Use

**Create a Merkle Tree**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
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

| Feature                                                                                                   | Status | Priority |
| --------------------------------------------------------------------------------------------------------- | ------ | -------- |
| Create Root                                                                                               | ✅     | 🔥       |
| Create Proof                                                                                              | ✅     | 🔥       |
| Verify Proof                                                                                              | ✅     | 🔥       |
| Use any Hash function                                                                                     | ✅     | 🧐       |
| Support **[OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/utilities#verifying_merkle_proofs)** | ⏰     | 🔥       |
| Compatible with **[MerkleTreeJs](https://github.com/miguelmota/merkletreejs)**                            | ⏰     | 🔥       |
| Leafs of any size                                                                                         | ⏰     | 🧐       |

## Contributing

- Before read a code of conduct: **[CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)**
- Follow the guide of development: **[CONTRIBUTING](CONTRIBUTING.md)**

## License

[MIT](LICENSE)

<!-- https://math.mit.edu/research/highschool/primes/materials/2018/Kuszmaul.pdf -->
