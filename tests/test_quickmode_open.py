import subprocess
from pathlib import Path


def test_mdbub_can_open_simplemap() -> None:
    """Test that 'poetry run mdbub' can open examples/mindmaps/simplemap.md without error."""
    test_file = Path(__file__).parent.parent / "examples" / "mindmaps" / "simplemap.md"
    assert test_file.exists(), f"File not found: {test_file}"
    cmd = ["poetry", "run", "mdbub", str(test_file)]
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
