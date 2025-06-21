# `mdbub` Enhanced Markdown Node Metadata

## ✨ Feature Overview

This feature enables `mdbub` users to embed **rich, optional metadata** in their `.md` mindmap files without breaking human readability or Markdown compatibility. Metadata allows users to tag, style, and categorize their thoughts—turning a plain tree into a richly visual, filterable, and extensible knowledge graph.

...

## ✅ Acceptance Criteria

- [x] Parser extracts tags and key:value metadata
- [x] Metadata does not interfere with normal Markdown editing
- [x] CLI supports filtering/searching by tags and props
- [x] Export maintains metadata optionally
- [x] Backward-compatible with existing `.md` node files


---

## 🔗 Link Notation Model

To support networked thinking and references between nodes, `mdbub` introduces **node linking** via two mechanisms: **inline links** and **reference-style links**. These help create a richer semantic web without cluttering the CLI UI.

---

### 🔄 Inline Links (`[[Linked Node Title]]`)

Supports lightweight linking between nodes directly in-line with the content.

```md
- Compare [[Textual canvas]] and [[prompt_toolkit]]
```

Parsed into:

```json
{
  "text": "Compare Textual canvas and prompt_toolkit",
  "links": ["Textual canvas", "prompt_toolkit"]
}
```

---

### ⚠️ Long Link Clutter Mitigation

To avoid overly long or noisy labels, we support **reference-style links** similar to Markdown:

```md
- Compare [[canvas]] and [[prompt]] [status:in-review]

[canvas]: Textual canvas rendering with layered decorators
[prompt]: prompt_toolkit TUI structures
```

This yields a clean UI label:

```
📌 Compare canvas and prompt (🔗)
```

And behind-the-scenes metadata:

```json
{
  "text": "Compare canvas and prompt",
  "links": ["canvas", "prompt"],
  "link_defs": {
    "canvas": "Textual canvas rendering with layered decorators",
    "prompt": "prompt_toolkit TUI structures"
  }
}
```

---

### 🧠 Best Practices

- Use inline links for quick ideas and short names
- Use `[key]: description` blocks for long labels
- Support link jumping, filtering (`mdbub find '[[canvas]]'`), and backlinks (`mdbub backlinks 'canvas'`)
- Future UI may show linked nodes in graph view or allow hover tooltips

---

### ✅ Parsing Strategy

- Inline link regex: `\[\[(.*?)\]\]`
- Reference-style regex: `^\[(.+?)\]:\s(.+)$`
- Link names are normalized (case-insensitive, slugged)
- Store both `links` and `link_defs` separately

---

### 🔮 Future Extensions

- Support for link aliases: `[[canvas|Canvas Renderer]]`
- Bi-directional backlinks viewer
- Graphviz or TUI graph rendering of link webs
