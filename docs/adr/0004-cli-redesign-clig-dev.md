# ADR-0004: CLI Redesign Following clig.dev Guidelines

## Status

Accepted

## Date

2026-02-18

## Context

The initial TypeScript port (ADR-0001 through ADR-0003) replicated the Python CLI's
flag-based interface (`--print-tags`, `--print-kv`, `--print-links`). After reviewing
the [Command Line Interface Guidelines](https://clig.dev/), the CLI needs a complete
redesign to follow modern best practices. No backwards compatibility is required.

## Key clig.dev Principles Applied

1. **Human-first design** — intuitive subcommands, empathetic errors, helpful defaults
2. **Composability** — stdout for data, stderr for messages, proper exit codes, `--json` and `--plain` output
3. **Consistency** — standard flag names, consistent subcommand patterns
4. **Discoverability** — examples in help text, `help` subcommand, suggest corrections
5. **Saying just enough** — concise default help, verbose only when asked

## Decision

### Subcommand Architecture (replacing flags)

```
mdbub <file>              Open mindmap in quick mode (default action)
mdbub tags <file>         List all #tags
mdbub kv <file>           List all @key:value metadata
mdbub links <file>        List all [id:...] anchors
mdbub view <file>         Display mindmap tree
mdbub version             Show version information
mdbub help [command]      Show help for a command
```

### Standard Flags (Global)

| Flag | Short | Description |
|------|-------|-------------|
| `--help` | `-h` | Show help |
| `--version` | `-V` | Show version |
| `--json` | | Machine-readable JSON output |
| `--plain` | | Plain text (no formatting, pipe-friendly) |
| `--no-color` | | Disable colors |
| `--quiet` | `-q` | Suppress non-essential output |

### Output Conventions

- **stdout**: Data output (mindmap content, tag lists, JSON, etc.)
- **stderr**: Messages, errors, hints, progress indicators
- **Colors**: Disabled when stdout is not a TTY, when `NO_COLOR` is set, or `--no-color` is passed
- **Exit codes**: 0 = success, 1 = user error (bad input, file not found), 2 = internal error

### Error Message Format

```
Error: Cannot read file 'missing.md' — file does not exist.

  To create a new mindmap:  mdbub missing.md
  For help:                 mdbub help
```

### Help Text Structure (following clig.dev)

```
mdbub — A mindmap tool for your terminal

USAGE
  mdbub <file>                  Open a mindmap for editing
  mdbub <command> [options]

EXAMPLES
  mdbub ideas.md                Open a mindmap for editing
  mdbub ideas.md#design/api     Jump to a node via deep link
  mdbub tags ideas.md           List all tags
  mdbub kv ideas.md --json      List metadata as JSON

COMMANDS
  tags <file>     List all #tags in a mindmap
  kv <file>       List all @key:value metadata
  links <file>    List all [id:...] anchors
  view <file>     Display the mindmap tree
  version         Show version information
  help [command]  Show help for a command

FLAGS
  -h, --help       Show help
  -V, --version    Show version
  -q, --quiet      Suppress non-essential output
  --json           Output as JSON
  --plain          Plain text output (no formatting)
  --no-color       Disable color output

FEEDBACK
  https://github.com/collabinator/mdbubbles/issues
```

## Rationale

- **Subcommands over flags**: `mdbub tags FILE` is more discoverable and composable than `mdbub --print-tags FILE`
- **`--json` flag**: Makes output machine-readable for scripting and piping to `jq`
- **`--plain` flag**: Ensures pipe-friendly output that works with `grep`, `awk`, etc.
- **stderr/stdout separation**: Allows piping data while seeing messages
- **Default file argument**: `mdbub FILE` directly opens quick mode — the most common action should be the shortest to type
- **Examples first**: Users learn from examples faster than flag descriptions

## Consequences

- Completely new CLI interface (no backwards compatibility needed per requirements)
- All subcommands follow the same `<verb> <file> [flags]` pattern
- Machine-friendly output available on every data-producing command
- Errors become documentation, not obstacles
