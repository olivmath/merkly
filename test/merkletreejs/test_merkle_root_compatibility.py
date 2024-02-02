from pytest import mark
import subprocess
import json


@mark.merkletreejs
def test_merkle_root_compatibility_between_merkletreejs_and_merkly(install_js_deps):
    result = subprocess.run(["yarn"], check=False)

    assert result.returncode == 0, result.stderr

    result_js = subprocess.run(
        ["node", "./merkle_root/merkle_root_test.js"],
        cwd="./test/merkletreejs",
        capture_output=True,
        text=True,
        check=False,
    )
    assert result_js.returncode == 0, result_js.stderr
    merkle_root_js = json.loads(result_js.stdout)

    result_py = subprocess.run(
        ["python", "./test/merkletreejs/merkle_root/merkle_root_test.py"],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result_py.returncode == 0, result_py.stderr
    merkle_root_py = json.loads(result_py.stdout)

    assert merkle_root_js == merkle_root_py
