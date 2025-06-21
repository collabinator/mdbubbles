
# `mdbub` Feature Proposal: CLI Split and Persistent Navigation

## ✨ Feature Summary

This proposal introduces two major enhancements to the `mdbub` toolset:

1. **Split CLI model**: Separate `mdbub` (quick CLI capture) from `mdbubbles` (full-screen TUI editor).
2. **Deep linking and state persistence**: Allow users to resume at the last focused node and/or jump directly to a specific node via CLI.

Together, these features improve modularity, speed, and UX continuity for users who work across sessions and tools.

---

## 🧠 Motivation

- **Separation of concerns**: Quick capture should remain fast and scriptable. Full editing should be immersive and visual.
- **Better user memory**: Persistent state makes `mdbub` feel more like a long-term thinking tool.
- **Deeper workflows**: Deep linking enables users to script workflows like `mdbub jump 'Design/API Layer'`.

---

## 🔧 Feature 1: CLI Executable Split

### Tools
- `mdbub` → lightweight CLI for capture and queries
- `mdbubbles` → full-screen visual TUI editor

### CLI Commands Comparison

| Command                  | `mdbub`           | `mdbubbles`        |
|--------------------------|-------------------|--------------------|
| Capture node             | ✅ `mdbub add`     | ❌                 |
| Filter/search            | ✅ `mdbub find`    | ✅ (interactive)   |
| Jump to a node           | ✅ `mdbub jump`    | ✅ `mdbubbles --node` |
| Visual editing           | ❌                | ✅                 |
| Folding, zoom, layout    | ❌                | ✅                 |

---

## 🔧 Feature 2: Persistent Navigation State

### Capabilities

- On exit, store:
  - Last focused node path (e.g., `Design/API Layer`)
  - Scroll/collapse state (optional)
- On launch, resume at that node unless overridden

### Stored in:
```yaml
~/.config/mdbub/state.yaml

last_opened_file: ./mindmap.md
last_focused_node: Design/API Layer
```

### CLI Overrides

```bash
mdbub jump "AI/Voice Module"
mdbubbles mindmap.md --node "Launch Plan/Alpha Test"
```

---

## 🔍 Example Use Cases

### Scenario 1: Scripting entry points
```bash
mdbub jump "Design/API Layer"
```

Open your map exactly where you're working without scanning.

---

### Scenario 2: Persistent workflow
```bash
# Auto-resume
mdbubbles
```

Session picks up right where you left off.

---

## 🔄 MVP Tasks

- [ ] Create `mdbubbles` binary alias or wrapper
- [ ] Shared config loader in both tools
- [ ] CLI param `--node "path"` to jump
- [ ] Persistent state writer on close
- [ ] Graceful fallback if node/path is missing

---

## 🔮 Future Extensions

- [ ] Named bookmarks (`mdbub mark focus`)
- [ ] Session history (`mdbub log --recent`)
- [ ] Sync state to cloud storage or repo

---

## ✅ Acceptance Criteria

- [x] CLI and TUI tools installable together
- [x] User can `jump` to any node path
- [x] User resumes where they left off (unless overridden)
- [x] Config/state file is durable, portable, and human-readable
