# mdbub Design Document

This document outlines the design, technology stack, and usage examples for **mdbub** (Markdown Bubbles), a terminal-first, interactive mind-map CLI tool—refined with UX insights to make it intuitive for both first-time and power users.

---

## 1. Overview & User Scenarios

**mdbub** empowers users to create, edit, and visualize Markdown-based mind maps directly in any ANSI-capable terminal. Typical workflows:

* **Design Notes & Brainstorming:** Capture nested bullet outlines, fold/unfold subtrees to focus on sections.
* **Problem Decomposition:** Break a complex issue into child tasks, drag nodes to reprioritize.
* **Planning & Roadmapping:** Map milestones as top-level nodes, annotate with metadata (due dates, owners), then export HTML for sharing.

Key goals:

* **Interactive CLI UX:** Full-screen tree editor with intuitive hotkeys, undo/redo, search/filter, and in-app help.
* **Read-only View & Exports:** Quick ASCII/Unicode tree (`view`), plus HTML/D3, SVG, DOT, JSON outputs (`export`).
* **Embedded Metadata:** A self-describing, versioned `mubub-format` block hidden in the file, with a summary panel for quick access.
* **Customization & Extensibility:** Themes, keybinding remapping, and a plugin API for integrations.

---

\$1

## 2.1 LLM Inference Integration

**Enable AI-assisted node creation and brainstorming directly in the CLI.** Inference can be run locally (e.g., llama.cpp, Hugging Face transformers) or via remote APIs (OpenAI, Anthropic):

| Feature                    | Option                                     | Rationale                                                     |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| Suggestion Generation      | `--local` / `--remote` via `mdbub suggest` | Auto-generate child nodes or branches based on context        |
| Summarization & Clustering | Remote API or local quantized model        | Collapse large subtrees into summaries or group related nodes |
| Custom Prompts             | Configurable per-project (`~/.mdbubrc`)    | Tailor AI prompts for brainstorming, task breakdown, tagging  |

### CLI & Editor Integration

* New command: `mdbub suggest [--local|--remote] [--model <name>]` to append AI-generated suggestions under the current node.
* Editor hotkey: `Ctrl+A` invokes inline suggestion mode and previews candidate nodes for insertion.
* Configurable caching and rate-limit settings in `~/.mdbubrc`.

### Implementation Considerations

* Abstract inference layer as a plugin, using entry points for providers (OpenAIPlugin, LocalLLMPlugin).
* Run inference asynchronously to avoid blocking the UI event loop; display progress indicators.
* Securely store API credentials (e.g., read from environment or encrypted keyring).

---

## 3. CLI Surface & Commands

```bash
# Initialize a new mind-map file with hidden metadata template
dbub init project-map.md

# Open full-screen interactive editor (MindMap mode)
mdbub edit project-map.md

# Render read-only ASCII/Unicode tree
mdbub view project-map.md

# Start live-reload HTTP preview (D3 + browser)
mdbub serve project-map.md

# Export to formats: HTML, SVG, DOT, JSON
# will infer type from extension if not provided
mdbub export project-map.md \
  --html out/project-map.html \
  --svg  out/project-map.svg \
  --dot  out/project-map.dot \
  --json out/project-map.json
```

**Onboarding Tip:** On first run, `mdbub edit` shows a quick-tip banner (`Press Alt+1 for MindMap mode; H for help`).

---

## 4. Interactive Editor Layout

```
┌─────────────────────────────────────────────────────────────────┐
│              mdbub – project-map.md  [MindMap Mode]             │
├─────────────────────────────────────────────────────────────────┤
│ • Roadmap                                                       │
│   ├─ Planning                                                   │
│   │   ├─ Goals                                                  │  ← current node
│   │   └─ Timeline                                               │
│   └─ Development                                                │
│       ├─ API                                                    │
│       └─ UI                                                     │
├─────────────────────────────────────────────────────────────────┤
│ [↑↓] Move  [←→] Indent/Outdent  [Enter] New  [Bkspc/Del] Delete │
│ [Ctrl-Z/Y] Undo/Redo  [Ctrl-F/G] Search/Next  [Ctrl+s] Save     │
│ [Space] Collapse [M] Metadata Panel  [H/?] Help  [Ctrl+c] Quit  │
└─────────────────────────────────────────────────────────────────┘
```

* **In-app Help (H or ?):** Brings up a cheat-sheet overlay of common hotkeys.
* **Metadata Panel (M):** Opens a side panel summarizing the hidden `mdbub-format` block (version, custom fields).
* **Undo/Redo (Ctrl+Z/Ctrl+Y):** Revert or reapply edits in the session.
* **Search/Filter (Ctrl+F):** Filter visible nodes by keyword; `G` jumps to next match.

### 4.1 Hotkey Reference

| Category           | Command                      | Description                                  |
| ------------------ | ---------------------------- | -------------------------------------------- |
| **Modes (future)** | Alt+1 / Alt+2 / Alt+3        | MindMap / Browse / File mode                 |
| **Navigation**     | ↑ ↓ ← →                      | Move cursor, indent, outdent                 |
|                    | Esc                          | Jump to root node                            |
|                    | Ctrl+Enter                   | Follow link                                  |
|                    | Alt+↑ / Alt+↓                | Zoom out / Zoom in                           |
| **Editing**        | Enter / Insert / Shift+Enter | New sibling / New child / New sibling before |
|                    | F2 / Alt+Enter               | Edit node text / Long-form editor            |
|                    | Del / Backspace              | Delete node (with confirmation)              |
|                    | Ctrl+J                       | Join nodes into one                          |
| **Formatting**     | Ctrl+B / Ctrl+I              | Bold / Italic                                |
|                    | Ctrl+Shift+B                 | Cloud (highlight)                            |
|                    | Alt+C / Alt+B / Alt+E        | Change node color / Blend color / Edge color |
|                    | Ctrl+L/M / Ctrl+Shift+L/M    | Increase/decrease node or branch font size   |
| **Clipboard**      | Ctrl+X / Ctrl+C / Ctrl+V     | Cut / Copy / Paste                           |
|                    | Ctrl+Y                       | Copy single                                  |
| **Links & Images** | Ctrl+K / Ctrl+Shift+K        | Link via text / file chooser                 |
|                    | Alt+K                        | Image via file chooser                       |
| **Others**         | Ctrl+F / Ctrl+G              | Find / Find next                             |
|                    | Space / Ctrl+Space           | Toggle node fold / children fold             |

---

### 4.2 Optional Vim-Style Mode

For users who prefer **vim**-style navigation and editing, **mdbub** can switch into a Vim-Mode that remaps common commands:

| Vim Action          | Vim Key   | mdbub Command Equivalent |
| ------------------- | --------- | ------------------------ |
| Move up             | `k`       | Up Arrow                 |
| Move down           | `j`       | Down Arrow               |
| Move left (outdent) | `h`       | Left Arrow               |
| Move right (indent) | `l`       | Right Arrow              |
| Enter insert mode   | `i`       | Enter (new node)         |
| Delete node         | `d`       | Del / Backspace          |
| Toggle fold         | `zc`/`zo` | L / R Square Bracket     |
| Save file           | `:w`      | automati                 |
| Quit                | `:q`      | Ctrl+c                   |

* **Toggle Vim-Style Mode:** Press `Ctrl+M` (or add `"vim_mode": true` in `~/.mdbubrc`).
* **Exiting insert mode:** `Esc` returns to navigation mode.

This mode provides a familiar workflow for vi/vim users while preserving the core **mdbub** UX.

---

## 5. File Structure Example

````markdown
# My Project Roadmap

- Roadmap
  - Planning
    - Goals
    - Timeline
  - Development
    - API
    - UI

---

<!-- mdbub-format -->
```yaml
version: 1.0

dictionary:
  node:
    label: string
    color?: string
    icon?: string
content:
  type: list
  mapping: markdown-list
````

````

> **Note:** The `<!-- mdbub-format -->` block lives after `---` and is hidden in the main view. Use `M` to open the metadata panel.

---

## 6. Read-Only & Export Examples

### 6.1 Read-Only Tree View

```bash
$ mdbub view project-map.md

My Project Roadmap
├─ Planning
│   ├─ Goals
│   └─ Timeline
└─ Development
    ├─ API
    └─ UI
````

### 6.2 HTML Export Snippet

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Mind Map</title></head>
<body>
  <div id="mindmap"></div>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script>
    const data = /* JSON from `mdbub export --json` */;
    // D3 collapsible tree rendering...
  </script>
</body>
</html>
```

---

## 7. Next Steps for Prototype

1. **Repo Setup:** GitHub org/repo `mdbub`, initial README with commands and UX goals.
2. **MVP Commands:** Implement `init`, `view`, and `export --json`.
3. **Interactive Editor:** Build Textual UI with hotkeys, undo/redo, search/filter, metadata panel, and help overlay.
4. **Themes & Config:** Support `~/.mdbubrc` for keybinding remaps and color themes.
5. **Plugin API:** Define entry-point hooks for custom commands, serializers, and integrations.
6. **Packaging & Distribution:** Publish to PyPI, Homebrew formula, and optionally Snap/Chocolatey.
7. **Feedback Loop:** Demo to users, gather insights, iterate on performance optimizations (virtualized rendering for large maps).
