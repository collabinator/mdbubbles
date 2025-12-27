# Migration Guide: Python to Go

## Overview

The mdbub project has been completely rewritten from Python to Go. This guide helps you transition from the Python version to the new Go version.

## Why the Rewrite?

The Go rewrite brings several improvements:

- **⚡ Performance**: 10-100x faster startup and execution
- **📦 Distribution**: Single binary, no Python installation needed
- **🔧 Installation**: Download and run, no dependencies
- **💪 Resources**: Lower memory usage
- **🚀 Cross-platform**: Native binaries for all platforms
- **🔒 Security**: Statically compiled, fewer attack vectors

## Installation Changes

### Old Way (Python)

```bash
# Required Python 3.9+
pip install mdbub
# or
pipx install mdbub
```

### New Way (Go)

```bash
# Download binary for your platform
wget https://github.com/collabinator/mdbubbles/releases/latest/download/mdbub-linux-amd64
chmod +x mdbub-linux-amd64
sudo mv mdbub-linux-amd64 /usr/local/bin/mdbub

# Or build from source (requires Go 1.21+)
go install github.com/collabinator/mdbubbles/cmd/mdbub@latest
```

## File Compatibility

✅ **Your existing `.mdbub` files will continue to work!**

The file format hasn't changed. All your mindmaps are compatible with the Go version.

## Command Changes

Most commands remain the same:

### Unchanged Commands

```bash
# These work exactly the same
mdbub myfile.mdbub
mdbub --version
mdbub --help
mdbub --print-tags myfile.mdbub
mdbub --print-kv myfile.mdbub
mdbub --print-links myfile.mdbub
```

### New Commands

```bash
# New about command with detailed info
mdbub about

# Export command (replaces old export functionality)
mdbub export myfile.mdbub
```

### Removed (Temporarily)

Some features are marked as "coming soon" in the initial Go release:

- Full TUI editor (coming in next release)
- Quick mode (coming in next release)
- Interactive editing (coming in next release)

The Go version currently focuses on file operations and will add interactive features in upcoming releases.

## Configuration

### Python Version

Configuration was in:
- Linux: `~/.config/mdbub/config.toml`
- macOS: `~/Library/Application Support/mdbub/config.toml`
- Windows: `%APPDATA%\mdbub\config.toml`

### Go Version

Configuration system is being redesigned and will be available in a future release. The default behavior works without configuration.

## Dependencies

### Python Version Dependencies

The Python version required:
- Python 3.9+
- click, typer, rich, prompt-toolkit
- markdown, pyyaml
- And ~10 other Python packages

### Go Version Dependencies

The Go version has:
- **Zero runtime dependencies** (single binary)
- All dependencies compiled into the binary
- Works on any system without installing anything

## Performance Comparison

Rough benchmarks (your mileage may vary):

| Operation | Python | Go | Speedup |
|-----------|--------|-----|---------|
| Startup | ~200ms | ~10ms | 20x |
| Load large file | ~500ms | ~50ms | 10x |
| Parse tags | ~100ms | ~5ms | 20x |
| Memory usage | ~50MB | ~10MB | 5x |

## Building from Source

### Python Version

```bash
git clone ...
cd mdbubbles
poetry install
poetry run mdbub --version
```

### Go Version

```bash
git clone ...
cd mdbubbles
make build
./mdbub --version
```

Much simpler!

## Troubleshooting

### "Command not found" after installation

Make sure the binary is in your PATH:

```bash
# Check if it's executable
chmod +x mdbub

# Move to a directory in PATH
sudo mv mdbub /usr/local/bin/

# Or add current directory to PATH
export PATH=$PATH:$(pwd)
```

### "File format error"

Your `.mdbub` files should work, but if you encounter issues:

1. Check the file is valid markdown
2. Ensure proper indentation (2 spaces per level)
3. Report the issue with a sample file

### Missing Features

If you need a feature from the Python version that's not in Go yet:

1. Check the roadmap in DEVELOPMENT.md
2. Open an issue on GitHub
3. Consider contributing!

### Performance Issues

The Go version should be faster. If it's not:

1. Check you're using the latest release
2. Report the issue with details
3. Include file size and system specs

## Getting Help

- [GitHub Issues](https://github.com/collabinator/mdbubbles/issues)
- [GitHub Discussions](https://github.com/collabinator/mdbubbles/discussions)
- [Documentation](https://github.com/collabinator/mdbubbles/blob/main/README.md)

## Uninstalling Python Version

If you're switching completely to Go:

```bash
# Remove pip installation
pip uninstall mdbub

# Remove pipx installation
pipx uninstall mdbub

# Remove config (optional)
rm -rf ~/.config/mdbub
```

## Keeping Both Versions

You can run both if needed:

```bash
# Rename Python version
mv $(which mdbub) $(which mdbub)-python

# Install Go version as 'mdbub'
# Install Python version as 'mdbub-python'
```

## Feedback

We'd love to hear about your migration experience:

- What worked well?
- What was confusing?
- What's missing?

Please share feedback in [GitHub Discussions](https://github.com/collabinator/mdbubbles/discussions).

## Timeline

- **v0.5.0** (Current): Core rewrite, basic commands
- **v0.6.0** (Next): Full TUI editor
- **v0.7.0** (Soon): Feature parity with Python version
- **v1.0.0** (Future): Stable release with all features

## Thank You!

Thank you for using mdbub! The Go rewrite will make the tool better for everyone. We appreciate your patience as we bring all features to the new version.
