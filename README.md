<p align="center">
  <a href="https://pypi.org/project/merkly/">
    <img alt="Fusion" src="./assets/merkle-tree.png" width="1000">
  </a>
</p>

<p align="center">The simple and easy implementation of Python Merkle Tree.</p>

---

<p align="center">
    <a href="https://pypi.org/project/merkly/">
        <img src="https://img.shields.io/pypi/v/merkly">
    </a>
    <a href="https://github.com/olivmath/merkly/actions/workflows/test.yml">
        <img src="https://github.com/olivmath/merkly/actions/workflows/test.yml/badge.svg?branch=main">
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
mtree = MerkleTree(['a', 'b', 'c', 'd']

# show original input
assert mtree.raw_leafs == ['a', 'b', 'c', 'd']

# show leafs
assert mtree.leafs == []
```

**Create a Root**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get root of tree
assert mtree.root == ""
```

**Create Proof of a leaf**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get proof of a leaf
assert mtree.proof("b") == []
```

**Verify Proof of a leaf**

```python
from merkly.mtree import MerkleTree

# create a Merkle Tree
mtree = MerkleTree(['a', 'b', 'c', 'd'])

# get proof of a leaf
p = mtree.proof("b")

# verify your proof
assert mtree.verify(p) == True
```

## Roadmap

| Feature                                                                                                   | Status | Priority |
| --------------------------------------------------------------------------------------------------------- | ------ | -------- |
| Create Root                                                                                               | ✅     | 🔥       |
| Create Proof                                                                                              | ✅     | 🔥       |
| Verify Proof                                                                                              | ✅     | 🔥       |
| Support **[OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/utilities#verifying_merkle_proofs)** | ⏰     | 🔥       |
| Compatible with **[MerkleTreeJs](https://github.com/miguelmota/merkletreejs)**                            | ⏰     | 🔥       |
| Use any Hash function                                                                                     | ⏰     | 🧐       |
| Leafs of any size                                                                                         | ⏰     | 🧐       |

## Contributing

- Before read a code of conduct: **[CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)**
- Follow the guide of development: **[CONTRIBUTING](CONTRIBUTING.md)**

## License

[MIT](LICENSE)

<!-- https://math.mit.edu/research/highschool/primes/materials/2018/Kuszmaul.pdf -->
