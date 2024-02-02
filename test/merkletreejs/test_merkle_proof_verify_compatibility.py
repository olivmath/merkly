from merkly.mtree import MerkleTree
from pytest import mark
import subprocess
import hashlib
import json

from merkly.node import Node, Side


@mark.merkletreejs
def test_merkle_proof_verify_compatibility_between_merkletreejs_and_merkly(
    install_js_deps,
):
    result = subprocess.run(["yarn"], check=False)

    assert result.returncode == 0, result.stderr

    result_js = subprocess.run(
        ["node", "./merkle_proof/merkle_proof_test.js"],
        cwd="./test/merkletreejs",
        capture_output=True,
        text=True,
        check=True,
    )
    assert result_js.returncode == 0, result_js.stderr
    data_js = json.loads(result_js.stdout)

    def sha256(x, y):
        data = x + y
        return hashlib.sha256(data).digest()

    proof_py = []
    for node in data_js["proof"]:
        side = Side.RIGHT if node["position"] == "right" else Side.LEFT
        data = bytes.fromhex(node["data"])
        proof_py.append(Node(data=data, side=side))

    leaves = ["a", "b", "c", "d", "e", "f", "g", "h"]
    mtree = MerkleTree(leaves, sha256)
    leaf = "a"

    assert mtree.verify(proof_py, leaf)
