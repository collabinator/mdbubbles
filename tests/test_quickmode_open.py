import shutil
import subprocess
import sys
from pathlib import Path

import pytest

poetry_bin = shutil.which("poetry")
pytestmark = pytest.mark.skipif(
    sys.platform.startswith("win") or not poetry_bin,
    reason="Poetry subprocess not supported on Windows CI or Poetry not found in PATH",
)


def test_mdbub_can_open_simplemap() -> None:
    """Test that 'poetry run mdbub' can open examples/mindmaps/simplemap.md without error."""
    test_file = Path(__file__).parent.parent / "examples" / "mindmaps" / "simplemap.md"
    assert test_file.exists(), f"File not found: {test_file}"
    poetry_bin = shutil.which("poetry")
    assert poetry_bin, "Poetry executable not found in PATH"
    cmd = [poetry_bin, "run", "mdbub", str(test_file)]
    proc = subprocess.Popen(
        cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    try:
        out, err = proc.communicate(input=b"\x04", timeout=5)
        print("STDOUT:", out.decode())
        print("STDERR:", err.decode())
    except subprocess.TimeoutExpired:
        proc.kill()
        out, err = proc.communicate()
        assert False, f"mdbub did not exit in time: {out.decode()} {err.decode()}"
    output = (out + err).decode().lower()
    assert "root" in output, f"Output did not contain 'root': {output}"
