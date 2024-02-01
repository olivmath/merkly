import subprocess

from pytest import fixture


@fixture(scope="session", autouse=True)
def compile_rust_ffi(request):
    if any("ffi" in item.keywords for item in request.session.items):
        print("Compiling Rust FFI")
        subprocess.run(["./build.sh"], cwd="./merkly/accelerator", check=True)
