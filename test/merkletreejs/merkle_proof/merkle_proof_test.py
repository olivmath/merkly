from merkly.mtree import MerkleTree
import hashlib
import json


def sha256(x, y):
    data = x + y
    return hashlib.sha256(data).digest()


leaves = ["a", "b", "c", "d", "e", "f", "g", "h"]
tree = MerkleTree(leaves, sha256)
leaf = "a"
proof = tree.proof(leaf)
formatted_proof = [
    {"data": node.data.hex(), "position": node.side.name.lower()} for node in proof
]

print(json.dumps({"proof": formatted_proof, "isValid": tree.verify(proof, leaf)}))
