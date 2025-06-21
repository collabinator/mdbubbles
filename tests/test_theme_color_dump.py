import os
import sys

import toml

EXAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "examples")

# List of all semantic roles to check (add/remove as needed)
ROLES = [
    "ACCENT",
    "HIGHLIGHT_BG",
    "TEXT",
    "DIM",
    "WARNING",
    "SUCCESS",
    "ERROR",
    "STATUS_BAR",
    "BREADCRUMB_BAR",
    "CHILD_HIGHLIGHT",
]

# For each role, check FG and BG
SUFFIXES = ["FG", "BG"]


def print_theme_colors(toml_path):
    print(f"\n=== Theme: {os.path.basename(toml_path)} ===")
    config = toml.load(toml_path)
    for role in ROLES:
        for suffix in SUFFIXES:
            key = f"COLOR_PRINTS_{role}_{suffix}"
            val = config.get(key, None)
            if val:
                # Print the colorized role name
                reset = config.get("COLOR_PRINTS_RESET", "\u001b[0m")
                print(f"{val}{key:<32} Sample Text{reset}")
    print("\u001b[0m")  # Reset at end


def main():
    # Find all .toml files in examples dir
    tomls = [f for f in os.listdir(EXAMPLES_DIR) if f.endswith(".toml")]
    for toml_file in tomls:
        print_theme_colors(os.path.join(EXAMPLES_DIR, toml_file))


if __name__ == "__main__":
    main()
