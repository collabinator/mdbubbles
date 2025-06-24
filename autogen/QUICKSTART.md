# MdBubbles Quickstart Guide

**MdBubbles** is a powerful TUI (Terminal User Interface) application for creating, editing, and navigating mindmaps with rich metadata support. It features a ranger-inspired 3-column layout, vim-like hotkeys, and advanced editing capabilities.

## 🚀 Getting Started

### Installation & Setup
```bash
# Clone and install
git clone <repository>
cd mdbubbles
poetry install

# Run the application
poetry run mdbub edit <your-mindmap.md>

# Or start with a new mindmap
poetry run mdbub init new-project.md
poetry run mdbub edit new-project.md
```

### Quick Test
```bash
# Try the comprehensive test
poetry run python test_label_edit_final.py
```

## 🎯 Core Features

### 🔍 Navigation (Ranger-Style 3-Column Layout)
- **Left Column**: Parent context and siblings
- **Middle Column**: Current level siblings (where you are)
- **Right Column**: Children preview

**Navigation Keys:**
- `Arrow Keys` or `WASD` - Navigate between nodes
- `Right/D` - Dive into selected node's children
- `Left/A` - Go back to parent level
- `Up/Down/W/S` - Move between siblings

### ✏️ Editing Modes

#### **Edit Mode (`e` key)**
- **Replace mode**: Completely replaces the node's content
- Shows existing label, tags, and links for editing
- Use when you want to rewrite the entire node

#### **Insert Mode (`i` key)**
- **Append mode**: Adds to the end of existing content
- Preserves current label, tags, and links
- Automatically adds a space before your new content
- Use when you want to add to existing content

**Edit Controls:**
- `Enter` - Save changes
- `Escape` - Cancel editing
- `Ctrl+S` - Manual save (also available anytime)
- `Ctrl+D` - Quit app (works even during editing)

**🔄 Autosave**
- **Automatic saving** after each edit
- **Real-time persistence** to your markdown file
- **Manual save** with `Ctrl+S` anytime
- **Save on quit** ensures no data loss

### 🏷️ Tags Support
Add tags to any node using `#tag` syntax:
```
My Task #urgent #work #deadline
Project Planning #important #review
```

**Features:**
- **Real-time preview** shows parsed tags
- **Persistent storage** in node metadata
- **Visual indicators** in tree view
- **Multiple tags** per node supported

### 🔗 Links Support
Create connections between nodes using link syntax:

#### **Inline Links**
```
See [[Project Overview]] for details
Reference [[Meeting Notes]] and [[Action Items]]
```

#### **Reference-Style Links**
```
[alias]: Full description or path
[meeting]: Weekly team standup notes
```

**Features:**
- **Link indicators** (🔗) appear next to linked nodes
- **Metadata storage** for link relationships
- **Visual distinction** in tree view
- **Both inline and reference** style support

### 🎨 Visual Features

#### **Node Indicators**
- `▶` - Node with children (expandable)
- `🔗` - Node contains links
- `(2)` - Child count (right-aligned)
- **Color coding**:
  - Blue: Selected node
  - Bright blue: Nodes with children
  - White: Normal nodes

#### **Status & Navigation**
- **Breadcrumb bar** - Shows current path
- **Status bar** - Current mode and instructions
- **Dynamic columns** - Responsive width adjustment
- **Child counts** - Right-aligned in parent/current columns

## ⌨️ Complete Hotkey Reference

### Global Actions (Work Everywhere)
- `Ctrl+S` - Save file manually
- `Ctrl+D` / `Ctrl+Q` - Quit application
- `?` - Show help
- `~` - Toggle view type (canvas/tree)

### Navigation (Tree Mode)
- `↑↓` or `W/S` - Move up/down in current level
- `←→` or `A/D` - Move between parent/child levels
- `Tab` - Add child node *(coming soon)*
- `Enter` - Add sibling node *(coming soon)*

### Editing
- `e` - Edit mode (replace content)
- `i` - Insert mode (append content)
- `Delete/Backspace` - Delete node *(coming soon)*

### In Edit Popup
- `Enter` - Save changes
- `Escape` - Cancel editing
- `Ctrl+D` - Quit app (bypasses popup)

## 🛠️ Advanced Usage

### Creating Rich Mindmaps
Combine all features for powerful mindmaps:

```
Project: Website Redesign #urgent #q1-2025
├── Research Phase #planning
│   ├── User Interviews [[User Research Guide]] #research
│   ├── Competitor Analysis #analysis
│   └── Technical Requirements [[Tech Stack Decisions]] #technical
├── Design Phase #design
│   ├── Wireframes [[Design System]] #wireframes
│   ├── Mockups #visual-design
│   └── Prototypes [[Interactive Demos]] #prototyping
└── Development Phase #development
    ├── Frontend [[React Components]] #frontend
    ├── Backend [[API Documentation]] #backend
    └── Testing [[Test Plan]] #qa #testing
```

### Productivity Tips

1. **Use Insert Mode** (`i`) to quickly add details to existing nodes
2. **Tag systematically** - use consistent tag naming
3. **Link related concepts** with `[[Node Name]]` syntax
4. **Navigate efficiently** - use breadcrumbs to track your location
5. **Preview children** in right column before diving deeper

### Customization

#### **Hotkey Configuration**
Hotkeys are loaded from configuration files and can be customized:
- Edit hotkeys in config files
- Vim-style alternatives (WASD) provided
- All actions support custom key bindings

#### **Themes**
- CSS-based theming system
- Located in `src/mdbub/themes/`
- Customizable colors, borders, and styling

## 🐛 Troubleshooting

### Common Issues

**"Navigation not working"**
- Ensure you're in tree mode (not canvas mode)
- Check if a popup is open (navigation disabled during editing)

**"Ctrl+D not quitting"**
- Should work globally, even during editing
- Try `Ctrl+Q` as alternative

**"Edit popup won't close"**
- Use `Enter` to save or `Escape` to cancel
- Avoid clicking outside popup

**"Tags/links not saving"**
- Ensure you press `Enter` to save
- Check syntax: `#tag` and `[[link]]`

### Debug Mode
Run with debug output:
```bash
poetry run python test_label_edit_final.py  # Shows debug info
```

## 🔮 Coming Soon

- **Node manipulation**: Add/delete/move nodes
- **Export formats**: PDF, HTML, other mindmap formats
- **Search functionality**: Find nodes by content/tags
- **Link navigation**: Jump between linked nodes
- **Undo/redo**: Edit history
- **Multiple views**: Split panes, zoom modes

## 📚 Examples

### Personal Knowledge Management
```
Knowledge Base #personal
├── Programming #coding
│   ├── Python [[Python Resources]] #python #learning
│   ├── JavaScript [[JS Projects]] #javascript
│   └── Tools [[Development Setup]] #tools #config
├── Books #reading
│   ├── Technical [[Tech Reading List]] #technical
│   └── Fiction [[Book Reviews]] #fiction #entertainment
└── Projects #portfolio
    ├── MdBubbles [[Project Notes]] #current #tui
    └── Website [[Design Ideas]] #web #future
```

### Work Planning
```
Sprint Planning #work #sprint-23
├── High Priority #p1
│   ├── Bug Fixes [[Critical Issues]] #bugs #urgent
│   ├── Feature A [[Requirements Doc]] #feature #customer
│   └── Code Review [[Review Guidelines]] #process
├── Medium Priority #p2
│   ├── Documentation [[API Docs]] #docs
│   └── Testing [[Test Coverage]] #qa
└── Low Priority #p3
    ├── Refactoring [[Tech Debt]] #maintenance
    └── Exploration [[Future Ideas]] #research
```

---

**Happy mindmapping!** 🧠✨

For more information, check the `/autogen` directory for detailed technical documentation and design decisions.
