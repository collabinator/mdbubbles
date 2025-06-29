#!/usr/bin/env python3
"""
make_resources.py: Generate Homebrew resource blocks from requirements.txt

Usage:
    python make_resources.py --file requirements.txt --output mdbub_resources.rb
"""
import argparse
from pathlib import Path

import requests


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Homebrew resource blocks from requirements.txt"
    )
    parser.add_argument(
        "--file", type=str, default="requirements.txt", help="Path to requirements.txt"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="mdbub_resources.rb",
        help="Output Ruby file for Homebrew resources",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    req_file = Path(args.file)
    output_file = Path(args.output)
    pypi_base_url = "https://pypi.org/pypi"
    seen = set()
    resource_blocks = []
    if not req_file.exists():
        print(f"[ERROR] requirements.txt not found: {req_file}")
        return
    with req_file.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("-e") or line.startswith("#") or not line:
                continue
            if ";" in line:
                pkg_spec, _ = line.split(";", 1)
            else:
                pkg_spec = line
            try:
                pkg_name, pkg_version = pkg_spec.split("==")
            except ValueError:
                print(f"[WARN] Skipping invalid line: {line}")
                continue
            # Ignore package extras
            if "[" in pkg_name:
                pkg_name = pkg_name.split("[")[0]
            if pkg_name in seen:
                continue
            seen.add(pkg_name)
            # Get PyPI info
            pkg_info_url = f"{pypi_base_url}/{pkg_name}/{pkg_version}/json"
            try:
                resp = requests.get(pkg_info_url, timeout=10)
                resp.raise_for_status()
                pkg_info = resp.json()
            except Exception as e:
                print(f"[WARN] Failed to fetch {pkg_name}=={pkg_version}: {e}")
                continue
            # Prefer wheels, fallback to sdist
            selected_url = None
            sha256 = None
            for url_info in pkg_info.get("urls", []):
                if url_info["filename"].endswith(".whl"):
                    selected_url = url_info["url"]
                    sha256 = url_info["digests"]["sha256"]
                    break
            if not selected_url:
                for url_info in pkg_info.get("urls", []):
                    if url_info["filename"].endswith(".tar.gz"):
                        selected_url = url_info["url"]
                        sha256 = url_info["digests"]["sha256"]
                        break
            if not selected_url or not sha256:
                print(
                    f"[WARN] No suitable distribution found for {pkg_name}=={pkg_version}"
                )
                continue
            resource_block = (
                f'resource "{pkg_name}" do\n'
                f'  url "{selected_url}"\n'
                f'  sha256 "{sha256}"\n'
                f"end\n\n"
            )
            resource_blocks.append(resource_block)
    with output_file.open("w", encoding="utf-8") as outfh:
        outfh.writelines(resource_blocks)
    print(f"[INFO] {len(resource_blocks)} resources written to {output_file}")


if __name__ == "__main__":
    main()
