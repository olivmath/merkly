import subprocess
from rich import print


def w_t():
    """
    # running `poetry run w-t` for watch tests
    """
    subprocess.run(["ptw", "test", "-vvx"])


def lint():
    """
    # running `poetry run lint` for run pylint
    """
    subprocess.run(["pylint", "merkly"])
