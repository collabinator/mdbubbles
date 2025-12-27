# 🧠 mdbub - Go Edition

> A mindmap tool for your terminal.
> Fast. Fluid. Keyboard-native. Built for thinkers who live in the CLI.

---

## 🚀 What is `mdbub`?

`mdbub` lets you build and manage mindmaps directly in your terminal. It's designed for speed-of-thought capture, with streamlined modes for lightning-fast inline edits and full-screen TUI visual editing.

Unlike plain Markdown, `mdbub` lets you *structure* your ideas—navigate, fold, tag, and rework them instantly, using only your keyboard.

**🎉 Now rewritten in Go!** Faster, more portable, easier to install, and better performance.

---

## ✨ What's New in the Go Version

This is a complete rewrite from Python to Go, bringing:

- **⚡ Better Performance**: Faster startup and execution
- **📦 Single Binary**: No Python dependencies, just download and run
- **🔧 Easier Installation**: Simple binary distribution for all platforms
- **🚀 Cross-Platform**: Native binaries for Linux, macOS, and Windows
- **💪 Better Resource Usage**: Lower memory footprint

---

## 🧨 Features

- **Quick Mode**: Instant mini-editor for rapid note capture (coming soon)
- **Edit Mode**: Full-screen terminal interface for folding, searching, tagging (coming soon)
- **Keyboard-native UX**: Everything is hotkey driven
- **Tag Support**: Add inline `#tags` to make nodes easier to find or filter
- **Metadata**: Add inline `@key:value` maps to track metadata of nodes
- **Link IDs**: Add inline `[id:something]` ids to create deep links
- **Export**: Export to various formats (coming soon)
- **Zero-mouse flow**: It's not just fast. It feels *alive* under your fingertips.

---

## 💡 Example

```bash
mdbub tech_idea.mdbub
```

It looks like this:

```
【AI-Driven Co...】 > 【Core Concept】 > 【Voice Intera...】
● Voice Interaction should be two-way
└─ No children
```

While you work:
- Add inline `#tags` to make them easier to find or filter
- Add inline `@key:value` maps to track metadata of nodes
- Add inline `[id:something]` ids to later link

---

## 🛠 Installation

### Binary Download (Recommended)

Download the latest release for your platform from the [Releases page](https://github.com/collabinator/mdbubbles/releases).

```bash
# Linux
wget https://github.com/collabinator/mdbubbles/releases/latest/download/mdbub-linux-amd64
chmod +x mdbub-linux-amd64
sudo mv mdbub-linux-amd64 /usr/local/bin/mdbub

# macOS (Intel)
wget https://github.com/collabinator/mdbubbles/releases/latest/download/mdbub-darwin-amd64
chmod +x mdbub-darwin-amd64
sudo mv mdbub-darwin-amd64 /usr/local/bin/mdbub

# macOS (Apple Silicon)
wget https://github.com/collabinator/mdbubbles/releases/latest/download/mdbub-darwin-arm64
chmod +x mdbub-darwin-arm64
sudo mv mdbub-darwin-arm64 /usr/local/bin/mdbub
```

### Build from Source

Requires Go 1.21 or later:

```bash
# Clone the repository
git clone https://github.com/collabinator/mdbubbles.git
cd mdbubbles

# Build
make build

# Or install directly
go install ./cmd/mdbub
```

---

## 🚦 Quick Start

```bash
# Get version
mdbub --version

# Get help
mdbub --help

# About the project
mdbub about

# Open a mindmap file
mdbub mymap.mdbub

# Print all tags in a file
mdbub --print-tags mymap.mdbub

# Export mindmap
mdbub export mymap.mdbub
```

---

## 🏗 Building

The project uses a Makefile for common tasks:

```bash
# Build the binary
make build

# Run tests
make test

# Run tests with coverage
make test-coverage

# Build for multiple platforms
make build-all

# Format code
make fmt

# Run linter
make lint

# Run all checks
make check
```

---

## 🧪 Testing

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

---

## 🤝 Contribute

Want to help shape the future of CLI-based structured thinking?

- [Open issues](https://github.com/collabinator/mdbubbles/issues)
- [Start a discussion](https://github.com/collabinator/mdbubbles/discussions)
- [Follow the roadmap](https://github.com/collabinator/mdbubbles/projects)

---

## 📝 Migration from Python Version

If you were using the Python version, the Go version maintains compatibility with the `.mdbub` file format. Your existing mindmap files will continue to work.

Key differences:
- Single binary instead of Python package
- Faster startup and execution
- No need for Python or Poetry
- Same commands and flags (mostly compatible)

---

## 🧠 Built for Thinkers

`mdbub` is for people who think in trees.
Who sketch in lists.
Who live in the terminal.
And who know that a good idea starts fast—and needs space to grow.

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

Original Python version design and concept by the mdbub team.
Go rewrite brings improved performance and portability to the terminal mindmap experience.
