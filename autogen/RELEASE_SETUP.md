# Release Setup Documentation

This document describes how to set up automated releases for mdbub across multiple platforms.

## Prerequisites

Before you can use the automated release system, you need to set up several things:

### 1. GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

- `PYPI_TOKEN`: Your PyPI API token (get from https://pypi.org/manage/account/token/)
- `HOMEBREW_TAP_TOKEN`: GitHub Personal Access Token with repo permissions
- `CHOCOLATEY_REPO_TOKEN`: GitHub Personal Access Token for your chocolatey-packages repo

### 2. Create Supporting Repositories

#### Homebrew Tap Repository
1. Create a new repository named `homebrew-tap` in your GitHub account
2. Add the formula from `packaging/homebrew/mdbub.rb` to this repository
3. Update the URLs in the formula to point to your actual repository

#### Chocolatey Packages Repository
1. Create a new repository named `chocolatey-packages` in your GitHub account
2. Copy the contents of `packaging/chocolatey/` to `mdbub/` in that repository
3. Update the URLs and metadata to point to your actual repository

### 3. Update Template Files

Replace `YOUR_USERNAME` in the following files with your actual GitHub username:

- `.github/workflows/release.yml`
- `packaging/homebrew/mdbub.rb`
- `packaging/chocolatey/mdbub.nuspec`
- `packaging/chocolatey/tools/chocolateyinstall.ps1`
- `packaging/arch/PKGBUILD`
- `pyproject.toml`

## Release Process

### Automated Release

To create a new release:

1. **Local release** (recommended):
   ```bash
   ./scripts/release.sh 1.2.0
   ```
   This will:
   - Run tests and linting
   - Update version in pyproject.toml
   - Create and push a git tag
   - Trigger the GitHub Actions release workflow

2. **Manual GitHub release**:
   - Go to GitHub → Releases → Create a new release
   - Choose tag version: `v1.2.0`
   - This will trigger the release workflow

3. **Workflow dispatch**:
   - Go to GitHub → Actions → Release workflow
   - Click "Run workflow"
   - Enter the version number (without 'v' prefix)

### What Happens During Release

The GitHub Actions workflow will:

1. **Test**: Run tests on Linux, macOS, and Windows with multiple Python versions
2. **Build**: Create platform-specific binaries using PyInstaller
3. **Release**: Create a GitHub release with all artifacts
4. **PyPI**: Publish the package to PyPI
5. **Homebrew**: Update the Homebrew formula (if tap is set up)
6. **Chocolatey**: Update the Chocolatey package (if repo is set up)

## Manual Package Management

If you prefer to manage packages manually:

### PyPI
```bash
poetry build
poetry publish
```

### Homebrew

#### Option 1: Official Homebrew Core (users run `brew install mdbub`)
1. Once your package is stable and has some popularity, submit to Homebrew Core
2. Create a PR to [homebrew-core](https://github.com/Homebrew/homebrew-core)
3. Follow their [contribution guidelines](https://docs.brew.sh/How-To-Open-a-Homebrew-Pull-Request)
4. Must meet their [acceptable formulae requirements](https://docs.brew.sh/Acceptable-Formulae)

#### Option 2: Personal Tap (users run `brew install YOUR_USERNAME/tap/mdbub`)
1. Update the formula in your homebrew-tap repository
2. Calculate SHA256: `shasum -a 256 mdbub-1.2.0.tar.gz`
3. Update version and SHA256 in the formula
4. Commit and push

### Chocolatey
1. Update version in `mdbub.nuspec`
2. Update download URL in `chocolateyinstall.ps1`
3. Calculate checksum: `Get-FileHash mdbub-windows.exe -Algorithm SHA256`
4. Update checksum in the install script
5. Submit to Chocolatey community repository

### Linux Distributions

#### AUR (Arch Linux)
1. Update `packaging/arch/PKGBUILD`
2. Calculate checksums: `updpkgsums`
3. Submit to AUR

#### Ubuntu PPA
1. Create debian packaging files
2. Build source package: `debuild -S`
3. Upload to Launchpad PPA

## Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backwards compatible manner
- **PATCH** version when you make backwards compatible bug fixes

Examples:
- `1.0.0` - Initial stable release
- `1.1.0` - New features, backwards compatible
- `1.1.1` - Bug fixes
- `2.0.0` - Breaking changes

## Troubleshooting

### Common Issues

1. **PyPI upload fails**: Check your `PYPI_TOKEN` secret
2. **Homebrew update fails**: Ensure `HOMEBREW_TAP_TOKEN` has repo permissions
3. **Tests fail**: Fix failing tests before releasing
4. **Version conflicts**: Ensure version doesn't already exist

### Debugging Releases

1. Check GitHub Actions logs for detailed error messages
2. Test locally with `./scripts/release.sh` first
3. Verify all secrets are correctly set in GitHub
4. Ensure supporting repositories exist and are accessible

## Best Practices

1. **Always test before releasing**: Run the full test suite
2. **Keep changelog updated**: Document changes in CHANGELOG.md
3. **Use descriptive commit messages**: Follow conventional commits
4. **Test installation**: Verify packages work after release
5. **Monitor feedback**: Watch for issues after release

## Future Improvements

Consider implementing:

- Automated changelog generation
- Pre-release (beta) versions
- Windows Store package
- Docker images
- Conda packages
- Linux distribution packages (DEB/RPM)
