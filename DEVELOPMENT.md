# Development Guide - mdbub Go Edition

## Overview

This is the Go rewrite of mdbub, a terminal-based mindmap tool. The project has been completely rewritten from Python to Go for better performance, easier distribution, and improved maintainability.

## Project Structure

```
mdbubbles/
├── cmd/
│   └── mdbub/           # Main application entry point
│       └── main.go
├── internal/
│   ├── cli/             # CLI commands and interface (cobra-based)
│   │   ├── root.go      # Root command and main CLI logic
│   │   ├── about.go     # About command
│   │   └── export.go    # Export command
│   ├── mindmap/         # Core mindmap data structures
│   │   ├── node.go      # Node structure and methods
│   │   ├── mindmap.go   # MindMap structure and methods
│   │   └── *_test.go    # Tests
│   ├── parser/          # Markdown parsing and serialization
│   │   └── parser.go    # Parser implementation
│   ├── ui/              # TUI components (to be implemented)
│   └── config/          # Configuration handling (to be implemented)
├── pkg/                 # Public libraries (if needed)
├── docs/                # Documentation
├── examples/            # Example mindmap files
├── go.mod               # Go module definition
├── go.sum               # Go module checksums
├── Makefile             # Build automation
└── README.md            # Main documentation
```

## Prerequisites

- Go 1.21 or later
- Make (optional, but recommended)

## Getting Started

### Clone the repository

```bash
git clone https://github.com/collabinator/mdbubbles.git
cd mdbubbles
```

### Build

```bash
# Using Make
make build

# Using go directly
go build -o mdbub ./cmd/mdbub
```

### Run

```bash
# Run directly
go run ./cmd/mdbub --help

# Or use the built binary
./mdbub --help
```

### Test

```bash
# Run all tests
make test

# Or with go directly
go test ./...

# With coverage
make test-coverage
```

## Development Workflow

### Making Changes

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Run tests: `make test`
5. Format code: `make fmt`
6. Run linter: `make vet`
7. Build: `make build`
8. Test the binary manually

### Code Style

- Follow standard Go conventions
- Use `gofmt` for formatting (run `make fmt`)
- Run `go vet` (run `make vet`)
- Keep functions focused and small
- Document exported functions and types

### Testing

- Write unit tests for all new functionality
- Tests should be in `*_test.go` files
- Use table-driven tests where appropriate
- Aim for >70% code coverage

### Adding New Commands

Commands are defined in `internal/cli/`. To add a new command:

1. Create a new file in `internal/cli/` (e.g., `mycommand.go`)
2. Define your command using cobra:
```go
var myCmd = &cobra.Command{
    Use:   "mycommand",
    Short: "Short description",
    Long:  "Long description",
    Run: func(cmd *cobra.Command, args []string) {
        // Implementation
    },
}
```
3. Register it in `root.go` in the `init()` function:
```go
rootCmd.AddCommand(myCmd)
```

## Building for Release

### Single Platform

```bash
make build
```

### Multiple Platforms

```bash
make build-all
```

This creates binaries for:
- Linux (amd64, arm64)
- macOS (amd64, arm64)
- Windows (amd64)

## Architecture

### Core Components

#### MindMap Data Structure

The core data structure is a tree of `Node` objects:

- **Node**: Represents a single mindmap node with label, children, metadata
- **MindMap**: Wrapper containing the root node and file metadata

#### Parser

The parser handles:
- Reading markdown files with indented lists
- Extracting inline metadata (#tags, @key:value, [id:...])
- Serializing mindmap back to markdown

#### CLI

Built with [cobra](https://github.com/spf13/cobra):
- Root command for opening files
- Subcommands for various operations
- Flags for different modes (--print-tags, --print-kv, etc.)

### Dependencies

Current dependencies (managed in go.mod):
- `github.com/spf13/cobra` - CLI framework

Future dependencies will likely include:
- TUI library (e.g., bubbletea, tview, or termui)
- Markdown rendering library

## Migration from Python

### What Changed

- **Language**: Python → Go
- **CLI Framework**: Typer → Cobra
- **Distribution**: Python package → Single binary
- **Performance**: Significantly faster

### What Stayed the Same

- File format (.mdbub markdown files)
- Command-line interface (mostly)
- Core concepts (nodes, tags, metadata, links)

### Migration Path for Users

Users can continue using their existing `.mdbub` files. The Go version maintains compatibility with the file format.

## Roadmap

### Phase 1 (Current)
- [x] Core data structures
- [x] CLI framework
- [x] Basic commands
- [x] Parser foundation
- [x] Tests
- [x] Documentation

### Phase 2 (Next)
- [ ] Complete parser implementation
- [ ] File I/O
- [ ] TUI interface
- [ ] Interactive editor
- [ ] Tag/metadata operations

### Phase 3 (Future)
- [ ] Export to various formats
- [ ] Quick mode
- [ ] Session restore
- [ ] Configuration system
- [ ] Plugin system

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Resources

- [Go Documentation](https://golang.org/doc/)
- [Cobra Documentation](https://github.com/spf13/cobra)
- [Project Issues](https://github.com/collabinator/mdbubbles/issues)
- [Project Discussions](https://github.com/collabinator/mdbubbles/discussions)

## License

Apache License 2.0 - see LICENSE file for details.
