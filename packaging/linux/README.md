# Linux Distribution Guide

## PyPI (recommended for all Linux distributions)

The easiest way to install mdbub on Linux is via PyPI:

```bash
pip install mdbub
# or
pipx install mdbub
```

## Distribution-specific packages

### Ubuntu/Debian (PPA)

To set up a PPA, you'll need to:

1. Create a Launchpad account
2. Set up GPG keys
3. Create a PPA repository
4. Upload packages

Example PPA setup:
```bash
sudo add-apt-repository ppa:YOUR_USERNAME/mdbub
sudo apt update
sudo apt install mdbub
```

### Arch Linux (AUR)

Create an AUR package:

1. Create a PKGBUILD file (see packaging/arch/PKGBUILD)
2. Submit to AUR
3. Users can install via AUR helpers:

```bash
yay -S mdbub
# or
paru -S mdbub
```

### Fedora/RHEL (RPM)

Create RPM packages:

```bash
# Build RPM
rpmbuild -ba packaging/rpm/mdbub.spec

# Install
sudo dnf install mdbub
```

### Snap Package

Build and publish to Snap Store:

```bash
snapcraft
sudo snap install mdbub
```

### AppImage

Create portable AppImage:

```bash
# Build AppImage using appimage-builder
appimage-builder --recipe packaging/appimage/AppImageBuilder.yml
```

### Flatpak

Create Flatpak package:

```bash
flatpak-builder build-dir packaging/flatpak/com.github.YOUR_USERNAME.mdbub.yml
```

## Recommended approach

For broad Linux compatibility, we recommend:

1. **Primary**: PyPI package (works everywhere with pip/pipx)
2. **Secondary**: Snap package (universal Linux package)
3. **Distribution-specific**: AUR for Arch, PPA for Ubuntu/Debian

The GitHub Actions workflow already handles PyPI publishing automatically.
