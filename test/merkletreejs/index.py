from Crypto.Hash import keccak

import hashlib


def hashing(data):
    return hashlib.sha256(data.encode()).hexdigest()


def hashing2(data: str):
    keccak_256 = keccak.new(digest_bits=256)
    keccak_256.update(data.encode())
    return keccak_256.hexdigest()


class MerkleTree:
    def __init__(self, leaves):
        self.leaves = [hashing2(leaf) for leaf in leaves]
        self.tree = self.build_tree(self.leaves)

    def build_tree(self, leaves):
        tree = [leaves]
        while len(tree[-1]) > 1:
            layer = tree[-1]
            next_layer = []
            for i in range(0, len(layer), 2):
                left = layer[i]
                right = layer[i + 1] if i + 1 < len(layer) else left
                next_layer.append(hashing2(left + right))
            tree.append(next_layer)
        return tree

    def get_merkle_root(self):
        return self.tree[-1][0] if self.tree else None


leaves = ["a", "b", "c", "d"]
tree = MerkleTree(leaves)

root = tree.get_merkle_root()
leafs = tree.leaves

for i in leafs:
    print(i)
print(root)
