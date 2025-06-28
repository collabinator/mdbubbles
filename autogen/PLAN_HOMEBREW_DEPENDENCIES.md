# Homebrew Formula Dependency Declaration Plan

## Goal
Update `packaging/homebrew/mdbub.rb` to fully comply with Homebrew Python-for-Formula-Authors guidelines by explicitly declaring all non-stdlib dependencies as `resource` blocks.

## Steps

- [x] Extract all runtime dependencies from `[tool.poetry.dependencies]` in `pyproject.toml`.
- [x] For each dependency (excluding `python` itself):
  - [x] Find the latest matching version and PyPI tarball URL.
  - [x] Compute or note the need for the correct SHA256 for each resource.
  - [x] Add a `resource` block for each dependency in the formula.
- [ ] Update the formula's `url` and `sha256` to match the latest release.
- [ ] Test formula install locally or via CI.
- [ ] Check off after successful install and test.

## Extracted Dependencies

- click
- markdown
- markdown-it-py
- packaging
- platformdirs
- prompt-toolkit
- pyyaml
- requests
- rich
- rich-click
- ruamel-yaml
- tomli
- typer

## Notes
- `python` is already specified as a dependency in the formula.
- For each dependency, use the PyPI sdist (tar.gz) URL and compute the SHA256.
- Homebrew will use these resources to populate the virtualenv at install time.
- After updating, bump the formula version and update the top-level `sha256` for the main tarball.
- Test with `brew install --build-from-source mdbub`.

---

## TODO
- [ ] Add all resource blocks to `packaging/homebrew/mdbub.rb`
- [ ] Update formula version and sha256
- [ ] Test install
- [ ] Remove this plan file after validation
