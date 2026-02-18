# ADR-0003: Migration Strategy

## Status

Accepted

## Date

2026-02-18

## Context

With the decision to port from Python to TypeScript/Ink (ADR-0001, ADR-0002), we need a phased migration strategy that minimizes risk and maintains a working product throughout the transition.

## Decision

### Phase 1: Foundation (This PR)

**Goal**: Establish the TypeScript project scaffold and port the core data model.

- [x] Write ADRs documenting the decision
- [ ] Initialize TypeScript project with Ink
- [ ] Port `MindMapNode` class and tree operations (`core/mindmap.ts`)
- [ ] Port markdown parser/serializer (`core/parser.ts`)
- [ ] Create basic CLI entry point with argument parsing
- [ ] Port `--version` and `--about` commands
- [ ] Port `--print-tags`, `--print-kv`, `--print-links` commands
- [ ] Set up Vitest with tests for core data model
- [ ] Set up ESLint + Prettier
- [ ] Validate: `npx tsx src/cli.tsx --version` works

### Phase 2: Quick Mode MVP

**Goal**: Replicate the core quick mode editing experience.

- [ ] Implement `useMindmap` hook for mindmap state management
- [ ] Implement `useKeyboard` hook for raw keyboard input
- [ ] Build `<Breadcrumbs>` component
- [ ] Build `<NodeEditor>` component (inline editing)
- [ ] Build `<ChildList>` component
- [ ] Build `<StatusBar>` component
- [ ] Compose into `<QuickMode>` screen
- [ ] Implement navigation (up/down/left/right through tree)
- [ ] Implement inline editing (type to edit, enter for sibling, tab for child)
- [ ] Implement file save on edit
- [ ] Validate: Can open, navigate, edit, and save a mindmap file

### Phase 3: Feature Parity

**Goal**: Match all Python v0.4.0 features.

- [ ] Deep linking (`file.md#path/to/node`)
- [ ] Session persistence (last file, last position)
- [ ] Configuration loading (`.mdbub.toml`)
- [ ] Theming and color customization
- [ ] Tag, key-value, and link metadata inline parsing
- [ ] Hidden backup files
- [ ] All keyboard shortcuts from Python version
- [ ] Validate: Full feature parity with Python v0.4.0

### Phase 4: Distribution & Deprecation

**Goal**: Replace Python distribution with TypeScript.

- [ ] Publish to npm (`npm install -g mdbub`)
- [ ] Update Homebrew formula
- [ ] Set up GitHub Actions CI/CD for TypeScript
- [ ] Update README with new installation instructions
- [ ] Deprecate Python package on PyPI
- [ ] Archive Python source under `legacy/` or separate branch

## File Coexistence Strategy

During migration, both codebases coexist in the repository:

```
/
├── src/mdbub/          # Python source (legacy, read-only during migration)
├── ts/                 # TypeScript source (new development)
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── tests/              # Python tests (legacy)
├── docs/adr/           # Architecture Decision Records
└── ...
```

The TypeScript code lives in `ts/` to avoid conflicts with the existing Python `src/` directory. Once Phase 3 is complete and feature parity is validated, the Python source moves to `legacy/` and the TypeScript source moves to the root.

## Rationale

- **Phased approach** reduces risk — each phase produces a working deliverable
- **Core data model first** ensures the foundation is solid before building UI
- **Coexistence** means the Python version remains available throughout migration
- **Feature parity before distribution** ensures users aren't disrupted

## Consequences

- Temporary maintenance burden of two codebases
- Phase 1-2 can be completed in a single focused sprint
- Python version remains the "released" version until Phase 4
- Contributors should focus new features on TypeScript version only
