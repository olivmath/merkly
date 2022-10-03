# 🌳 Merkly

The **simple and easy** implementation of **Python Merkle Tree**

---

[![CodeQL](https://github.com/olivmath/merkly/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/olivmath/merkly/actions/workflows/codeql-analysis.yml)
[![Lint](https://github.com/olivmath/merkly/actions/workflows/lint.yml/badge.svg)](https://github.com/olivmath/merkly/actions/workflows/lint.yml)
[![Test](https://github.com/olivmath/merkly/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/olivmath/merkly/actions/workflows/test.yml)
[![PyPI](https://img.shields.io/pypi/v/merkly)](https://pypi.org/project/merkly/)

![GitHub last commit](https://img.shields.io/github/last-commit/olivmath/merkly)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/olivmath/merkly)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/merkly)](https://pypi.org/project/merkly/)
[![PyPI - Downloads](https://img.shields.io/pypi/dm/merkly)](https://pypi.org/project/merkly/)
![PyPI - License](https://img.shields.io/pypi/l/merkly)

## Table of Contents

- [Credits](#credits)
- [How to install](#how-to-install)
- [How to works](#how-to-works)
- [How to use](#how-to-use)
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

This library provides a clean and easy to use implementation of the Merkle Tree with the following features:

- [x] Create Leaf
- [x] Create Root
- [x] Create Proof
- [x] Verify Proof

![Merkle Tree](assets/merkle-tree.png)

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


## Contributing

- Before read a code of conduct: **[CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)**
- Follow the guide of development: **[CONTRIBUTING](CONTRIBUTING.md)**

## License

[MIT](LICENSE)

<!-- https://math.mit.edu/research/highschool/primes/materials/2018/Kuszmaul.pdf -->
