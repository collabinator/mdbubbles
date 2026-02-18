# ADR-0001: CLI Framework Evaluation

## Status

Accepted

## Date

2026-02-18

## Context

`mdbub` is a terminal-first interactive mindmap CLI tool currently implemented in Python (v0.4.0, ~2,500 LOC across 14 source files). The project uses Typer for CLI argument parsing, Rich for terminal rendering, and prompt-toolkit for interactive input handling.

The project manifesto plans to split into two experiences:
- `mdbub` — ultra-fast inline CLI for capture, editing, filtering, and searching
- `mdbubbles` — full-screen TUI for visual editing, folding, and deep exploration

We need to evaluate whether to continue maintaining the Python implementation or port to a more robust CLI framework, specifically one similar to what Gemini-CLI uses (TypeScript + Ink/React).

## Options Evaluated

### Option A: Stay with Python (Typer + Rich + prompt-toolkit)

**Pros:**
- Existing working codebase with packaging infrastructure (PyPI, Homebrew, Chocolatey)
- Python's Rich library provides excellent terminal rendering
- prompt-toolkit is battle-tested for interactive terminal input
- Lower barrier to entry for contributors familiar with Python
- Could upgrade TUI portions to Textual (by Rich's author) for richer components

**Cons:**
- The quick mode implementation (1,471 lines in a single file) is tightly coupled — mixing raw terminal I/O (`termios`, `fcntl`, `tty`) with rendering logic, state management, and keyboard handling
- Python distribution remains challenging (pip dependency conflicts, venv requirements, platform-specific builds via PyInstaller)
- No component model — UI is imperative, making the planned CLI/TUI split harder to architect cleanly
- Limited type safety (mypy strict mode is disabled for commands/ and cli.py)
- Minimal test coverage (2 test files) suggests the current architecture is hard to test in isolation

### Option B: Port to TypeScript + Ink (React for CLI)

**Pros:**
- **Declarative component model**: Ink brings React's component architecture to the terminal — perfect for the planned `mdbub`/`mdbubbles` split where UI elements are composable, testable units
- **State management**: React hooks and context provide structured state management, replacing the current global mutable state pattern
- **Type safety**: TypeScript provides compile-time type checking across the entire codebase, critical for tree data structures and complex navigation state
- **Distribution**: npm provides universal cross-platform installation; single-binary distribution possible via `pkg` or `vercel/ncc`
- **Proven at scale**: Gemini-CLI demonstrates this stack handles complex interactive CLI applications with rich terminal UIs
- **Testability**: React Testing Library patterns work with Ink, enabling component-level testing
- **Ecosystem**: npm has extensive terminal UI libraries (chalk, figures, cli-spinners, etc.)

**Cons:**
- Requires full rewrite of existing codebase
- Node.js runtime dependency (though bundling mitigates this)
- Team needs TypeScript/React familiarity
- Lose existing Python packaging infrastructure

### Option C: Port to Rust (Ratatui)

**Pros:**
- Zero-dependency single binary distribution
- Maximum performance for terminal rendering
- Memory safety guarantees

**Cons:**
- Highest development cost and steepest learning curve
- Slower iteration speed for a TUI-heavy project still in beta
- Smaller pool of potential contributors

## Decision

**Port to TypeScript + Ink (Option B).**

## Rationale

1. **Architecture alignment**: The manifesto explicitly plans a CLI/TUI split. Ink's React component model naturally maps to this — `mdbub` commands become lightweight CLI components while `mdbubbles` TUI views become rich interactive components sharing the same core data model.

2. **Current code signals a rewrite is warranted**: The quick mode module (1,471 lines) mixes raw terminal I/O with rendering, state, and input handling. This monolithic approach doesn't scale for the Version 1 features planned (tagging, link graphs, multi-map sessions, plugin architecture). A port is an opportunity to decompose properly.

3. **Minimal test coverage makes porting feasible**: With only 2 test files, there's little testing infrastructure to preserve. The port can establish proper testing patterns from the start.

4. **Distribution improvement**: Python packaging (pip, PyInstaller, Homebrew formulae with Python dependency trees) is a known pain point. npm + optional binary bundling simplifies this significantly.

5. **Codebase size makes porting practical**: At ~2,500 lines total, this is a manageable rewrite. The core data model (MindMapNode, markdown parser) is ~240 lines and ports directly.

## Consequences

- The Python codebase becomes legacy and will not receive new features
- Need to establish new CI/CD pipelines for TypeScript
- Need to rebuild packaging for npm, Homebrew, etc.
- Contributors need TypeScript/React familiarity
- The port provides a clean break to address architectural debt
