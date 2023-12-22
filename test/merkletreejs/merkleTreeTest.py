from merkly.mtree import MerkleTree
import hashlib
import json

def sha256(data):
    return hashlib.sha256(data.encode()).hexdigest()

leaves = ["a", "b", "c", "d"]
tree = MerkleTree(leaves, sha256, merkletreejs=True)
root = tree.root()

print(json.dumps({"merkleRoot": root}))
