# ADR-0002: Technology Selection for TypeScript Port

## Status

Accepted

## Date

2026-02-18

## Context

Following ADR-0001's decision to port from Python to TypeScript, we need to define the specific technology choices for the new implementation.

## Decision

### Core Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | TypeScript | 5.x | Type-safe development |
| Runtime | Node.js | ≥20.x | Cross-platform execution |
| CLI Framework | Ink | 5.x | React-based terminal UI |
| UI Components | React | 18.x | Declarative component model |
| CLI Parsing | Commander / Pastel | latest | Argument parsing and subcommands |
| Terminal Styling | chalk + cli-boxes | latest | Colors, formatting, box drawing |
| Markdown Parsing | unified + remark | latest | Markdown AST processing |
| Configuration | cosmiconfig | latest | Config file discovery (.mdbub.toml, etc.) |
| Testing | Vitest + ink-testing-library | latest | Unit and component testing |
| Build | tsup | latest | Bundling for distribution |
| Linting | ESLint + Prettier | latest | Code quality |

### Architecture Decisions

**Project Structure:**
```
src/
├── cli.tsx              # Entry point, argument parsing
├── app.tsx              # Root Ink application component
├── core/
│   ├── mindmap.ts       # MindMapNode class, tree operations
│   ├── parser.ts        # Markdown ↔ MindMapNode serialization
│   └── types.ts         # Shared TypeScript interfaces
├── components/
│   ├── Breadcrumbs.tsx  # Navigation breadcrumb bar
│   ├── NodeEditor.tsx   # Inline node editing
│   ├── ChildList.tsx    # Child node display
│   └── StatusBar.tsx    # Status bar with messages
├── commands/
│   ├── quick.tsx        # Quick mode (inline editor)
│   ├── print-tags.ts    # --print-tags output
│   ├── print-kv.ts      # --print-kv output
│   ├── print-links.ts   # --print-links output
│   └── version.ts       # --version output
├── hooks/
│   ├── useKeyboard.ts   # Keyboard input handling
│   ├── useMindmap.ts    # Mindmap state management
│   └── useSession.ts    # Session persistence
└── config/
    ├── defaults.ts      # Default configuration values
    └── loader.ts        # Config file loading
```

**Key Patterns:**
- **React Context** for global state (current node, file state, configuration)
- **Custom hooks** for encapsulating keyboard handling, mindmap mutations, session persistence
- **Ink components** for each visual element (breadcrumbs, node editor, child list, status bar)
- **Separation of concerns**: Core data model (`core/`) has zero UI dependencies

### Package Distribution

- **npm**: Primary distribution channel (`npm install -g mdbub`)
- **npx**: Zero-install usage (`npx mdbub myfile.md`)
- **Homebrew**: Via tap with Node.js dependency
- **Binary**: Optional single-binary via `pkg` for users without Node.js

## Rationale

- **Ink 5.x** is the latest stable version, used by Gemini-CLI, with active maintenance
- **Vitest** over Jest for faster test execution and native TypeScript support
- **tsup** for zero-config bundling with tree-shaking
- **unified/remark** for proper markdown AST parsing (more robust than regex-based approach)
- **cosmiconfig** supports .toml, .yaml, .json, and .js config files — maintaining compatibility with existing `.mdbub.toml`

## Consequences

- Node.js ≥20 becomes a runtime requirement (unless bundled as binary)
- npm ecosystem dependency management (package-lock.json)
- React/Ink learning curve for contributors unfamiliar with React
- Rich component testing patterns available from day one
