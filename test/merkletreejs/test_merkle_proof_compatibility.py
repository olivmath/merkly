from pytest import mark
import subprocess
import json


@mark.merkletreejs
def test_merkle_proof_compatibility_between_merkletreejs_and_merkly(install_js_deps):
    result = subprocess.run(["yarn"], check=False)

    assert result.returncode == 0, result.stderr

    result_js = subprocess.run(
        ["node", "./merkle_proof/merkle_proof_test.js"],
        capture_output=True,
        cwd="./test/merkletreejs",
        text=True,
        check=True,
    )
    assert result_js.returncode == 0, result_js.stderr
    data_js = json.loads(result_js.stdout)

    result_py = subprocess.run(
        ["python", "./test/merkletreejs/merkle_proof/merkle_proof_test.py"],
        capture_output=True,
        text=True,
        check=True,
    )
    assert result_py.returncode == 0, result_py.stderr
    data_py = json.loads(result_py.stdout)

    assert data_js == data_py
