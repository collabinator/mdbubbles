# Markdown Bubbles (aka mdbub)

## Vision / Concept

`mdbub` is a mindmap tool for your terminal.

It’s built for fast thinkers who love their keyboard. Whether you're capturing a flurry of ideas, organizing research, or mapping out your next big project, `mdbub` is your expressive outlet. It's not just functional—it should feel *fluid*.

Update: We’re splitting the tool into two optimized experiences:
- `mdbub` — ultra-fast inline CLI for capture, editing, filtering, and searching.
- `mdbubbles` — full-screen TUI for visual editing, folding, and deep exploration.

Designed to be delightful to use entirely from the keyboard, with customizable hotkeys and expressive syntax, this ecosystem lets you think at the speed of thought. And because it’s CLI-native, it’s composable in the best UNIX spirit—ready to interoperate with everything else you do in the shell.

This is for the chaos-to-clarity thinkers. We’re building it because no other tool feels this good under your fingers.

---

## Pillars

* **Lightning-fast keyboard UX** – Defaults that feel great, and hotkey configs that can be remapped.
* **Visual clarity in text** – Intuitive hierarchy rendered in markdown and styled output.
* **Deep Linking** – Navigate directly to any node via `filename.md#path/to/node`.
* **Persistent State** – Resume where you left off, always.
* **Composable with UNIX** – Designed to interoperate with pipes and shell tools.
* **Minimal dependencies** – Instant startup, cross-platform joy.

---

## MVP

A focused, usable CLI-first tool for capturing and navigating ideas:

* `mdbub` initializes or loads a `.md`-formatted mindmap file.
* **Quick Mode (`mdbub`)**:
  * Add/edit/delete nodes inline.
  * Show breadcrumbs and child preview panel.
  * Just start typing to edit node; saves automatically.
  * Navigate via up/down/left/right, jump to children or back to parents.
* Add inline metadata with `#tags` and `@key:value`.
* Set node ids and create links with `[id:path/to/node]` and `[[path/to/node]]`.
* CLI deep linking via node id `mdbub roadmap.md#product/ai`.
* Persistent state: last open file, last focus, optional scroll memory.
* Configurable hotkeys via `.mdbub.toml`.
* Hidden backup files for version recovery.

---

## Version 1

Solid enough for power users and contributors:

* Tagging and node metadata fully supported.
* Full link graph: forward and backward links.
* Export formats: Markdown, OPML, JSON.
* Multi-map session support.
* Keyboard-driven reordering and promotion/demotion.
* Reloadable configs and user theming.
* Plugin architecture groundwork.
* Minimalistic graph viz view in quick mode.
* Smart metadata parsing: `color`, `style`, `status`, `refs`.
* **Edit Mode (`mdbubbles`)**:
  * Full-screen TUI node view.
  * Hotkey-based editing, searching, and folding.
  * Theming and help overlays.

| Command      | Meaning                        | Use When You Want To...                |
| ------------ | ------------------------------ | -------------------------------------- |
| `mdbub find` | **Full-text or filter search** | Search *any* text, tag, id, or pattern |
| `mdbub tag`  | **Tag-focused insight or ops** | View, count, or explore *tags only*    |

---

## Future Versions

* **Pipe Mode**:
  * Read from and write to other CLI tools via structured text streams.
* **Live Collaboration**:
  * Pair mode over local or remote socket connection.
* **Markdown-aware sync**:
  * Bidirectional conversion between `.md` and `.json`.
* **AI Assistants**:
  * Context-aware expansion, rephrasing, or auto-linking.
* **Vim-style movement keys**
* **Visual exports**:
  * SVG, HTML, or TUI-graph overlays
* **Bookmarking, sessions, node timestamps**

---

## Champion
@dudash

This tool is for the keyboard obsessives, like me, the chaotic thinkers who structure as they go. It’s for anyone who’s ever wanted a whiteboard in their terminal. I want to build a tool that feels *like it connects your fingers to your thoughts*—where each keystroke inks your ideas into structure.

---

## Inspiration Sources
- **Ranger File Manager**: Efficient keyboard navigation
- **Vim**: Efficient editing and modal thinking
- **MindMeister**: Clean, hierarchical mind maps
- **Obsidian**: Tagging, graph structure, and linking
- **fzf**: Lightning-fast search and navigation
