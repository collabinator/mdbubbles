# `mdbub` Quick Mode UX Design

## Core Philosophy

Quick Mode is designed for **speed and minimal friction** when exploring and editing mindmaps. It embraces these principles:

1. **Keyboard-first:** All actions are accessible via keyboard shortcuts that respect muscle memory
2. **Minimalist UI:** Only essential information is displayed to minimize cognitive load
3. **Contextual awareness:** The UI adapts to show relevant information based on current position
4. **Immediate feedback:** Edits are applied and saved instantly
5. **Unix-like simplicity:** Follows the "do one thing well" design principle

## UI Layout

```
ROOT > Some branch > Current parent              [breadcrumbs]
● Current node text is directly editable here    [current node]
└─ [◀ more] [Child 3] [Child 4] [Child 5] [Child 6] [more ▶]  [7/30] [children view]

[Status: Saved] [^C:Quit] [↑↓←→:Navigate] [/:Search]
```

## Components

### 1. Breadcrumb Navigation

```
ROOT > Branch > ... > Parent
```

- Shows the path from root to current node's parent
- Uses `>` as separator for visual clarity
- Long paths truncated in middle with `...`
- Color-coded: root (bold cyan), branches (white), current parent (bold white)

**Rationale:** Provides spatial awareness without consuming vertical space. The truncation ensures the breadcrumb remains useful even with deep hierarchies.

### 2. Current Node Display

```
● Current node text is directly editable here
```

- Prefixed with a bullet symbol (`●`) for visual anchoring
- Text is directly editable without entering a special "edit mode"
- Typing anywhere replaces the current node text
- Backspace/delete work as expected
- Enter commits changes and creates a new sibling
- Tab creates a new child node

**Rationale:** By eliminating mode-switching for editing, we reduce cognitive overhead and increase speed. The bullet provides a consistent visual reference point.

### 3. Children View

```
└─ [◀ more] [Child 3] [Child 4] [Child 5] [Child 6] [more ▶]  [7/30]
```

- Shows immediate children of the current node in a horizontal layout
- Children displayed in brackets for visual clarity
- Selected child highlighted with a color bar (cyan background)
- Windowed view for many siblings (5-7 siblings visible at once)
- Pagination indicators (`◀ more`, `more ▶`) when more siblings exist
- Position indicator shows current selection and total count (`[7/30]`)
- Left/right arrows navigate between visible siblings
- Alt+←/→ jumps to first/last child
- Down arrow focuses the selected child (makes it current node)
- Up arrow navigates to parent node

**Rationale:** The horizontal layout with pagination is spatially efficient and scales well for nodes with many children. The windowed approach prevents overwhelming the user while maintaining context.

### 4. Status Bar

```
[Status: Saved] [^C:Quit] [↑↓←→:Navigate] [/:Search]
```

- Left side shows current status (Saved, Editing, etc.)
- Right side shows contextually relevant hotkeys
- Color-coded for quick scanning (status in green/yellow/red, hotkeys in cyan)

**Rationale:** Provides essential feedback and guidance without requiring memorization of all commands.

## States and Transitions

### Mode Transition Flow

1. **Navigation Mode** (default)
   - Arrow keys: Navigate the tree
   - Typing: Enter editing mode
   - Tab: Create new child
   - Enter: Create new sibling
   - Delete: Enter delete confirmation
   - `/`: Enter search mode
   - F1: Show help overlay
   - Ctrl+X: Exit Quick Mode

2. **Editing Mode**
   - Enter: Save changes and return to navigation mode
   - Escape: Cancel changes and return to navigation mode
   - All other keys: Edit text as normal

3. **Delete Confirmation**
   - Y: Confirm delete and return to navigation mode
   - N: Cancel delete and return to navigation mode
   - Escape: Same as N, cancel and return to navigation

4. **Search Mode**
   - Typing: Update search term
   - Left/Right: Navigate between matches
   - Enter: Select match and return to navigation mode
   - Escape: Cancel search and return to navigation mode

### Navigation State

```
ROOT > Some branch > Current parent
● Current node text
└─ [◀ more] [Child 3] [Child 4] [Child 5] [Child 6] [more ▶]  [7/30]

[Status: Ready] [^C:Quit] [↑↓←→:Navigate] [/:Search]
```

- Arrow keys navigate the tree
- Left/right arrows select among children (highlighted with background color)
- Up arrow navigates to parent node
- Down arrow focuses the currently selected child
- Any alphanumeric key starts editing the current node
- Hotkeys trigger actions (new nodes, delete, etc.)

### Editing State

```
ROOT > Some branch > Current parent
● My new text|
└─ [Child 1]

[Status: Editing] [Enter:Save] [Esc:Cancel]
```

- Text is directly editable
- Cursor visible at editing point
- Limited hotkeys available during editing
- Enter commits changes
- Escape cancels edit

### Search State

```
ROOT > Some branch > Current parent
● Current node text

[Search: example] [3 matches]
└─ [Matched Child 1] [Matched Child 2] [Matched Child 3]  [1/3]

[Status: Searching] [←→:Next/Prev] [Enter:Select] [Esc:Cancel]
```

- Activated by pressing `/` in navigation mode
- Type search term directly after the prompt
- Only matching children displayed in the children view
- Match count shows position and total (`[1/3]`)
- Left/right arrows navigate between matches
- Enter selects and focuses the current match
- Escape returns to normal navigation mode

## Sibling Navigation

In the Quick Mode design, siblings are not directly visible when viewing a node. Instead:

1. **Viewing Siblings**: Navigate up (↑) to the parent node, where all siblings appear as children
2. **Context Understanding**: When viewing a node, you're seeing its children, not its siblings
3. **Efficient Navigation Flow**:
   - To move to a sibling: Up (↑) to parent, then Left/Right (←/→) to select, Down (↓) to focus
   - To quickly jump between siblings at the same level: Alt+←/Alt+→ after going up to the parent

**Rationale:** This approach maintains UI simplicity while still enabling complete navigation of the mindmap structure. The mental model of "up to see siblings, down to explore children" creates a consistent spatial metaphor.

## Input Handling

### Hotkey Philosophy

- Use familiar patterns from popular terminal tools
- All alphabetical keys are reserved for direct node editing
- Minimal modifier key usage for common operations
- Consistent contextual hotkeys

### Core Hotkeys

| Key          | Action                            |
|--------------|-----------------------------------|
| ↑            | Navigate to parent node           |
| ↓            | Focus selected child node         |
| ← / →        | Select previous/next child        |
| Alt+← / Alt+→| Jump to first/last child          |
| Alt+↑        | Jump to root node                 |
| Enter        | In nav: Create sibling after current<br>In edit: Save changes |
| Tab          | Create child node                 |
| Delete       | Delete current node (with confirm)|
| F1           | Show help overlay                 |
| Esc          | Cancel current operation          |
| Ctrl+S       | Force save                        |
| Ctrl+X       | Exit (with save prompt if needed) |
| Ctrl+F       | Search mode                       |

### Custom Hotkeys

- All hotkeys configurable in `.mdbubrc`
- Format follows existing hotkey structure
- Example:

```yaml
quickmode:
  add_child: "tab"
  add_sibling: "enter"
  navigate_up: "up"
  navigate_down: "down"
  navigate_left: "left"
  navigate_right: "right"
  navigate_first_child: "alt+left"
  navigate_last_child: "alt+right"
  navigate_root: "alt+up"
  delete_node: "delete"
  # etc.
```

## Common Usage Flows

### Navigation to Editing Flow

**1. User is in navigation mode, viewing nodes:**
```
ROOT > Project Ideas
● Feature Requests
└─ [Mobile app support] [Dark mode] [Voice commands]

[Status: Ready] [←→:Select] [↓:Focus] [↑:Parent] [Tab:Add Child]
```

**2. User starts typing any letter, automatically enters edit mode for current node:**
```
ROOT > Project Ideas
● F|                     ← Cursor appears, old text is cleared
└─ [Mobile app support] [Dark mode] [Voice commands]

[Status: Editing] [Enter:Save] [Esc:Cancel]
```

**3a. User completes edit and presses Enter:**
```
ROOT > Project Ideas
● Feature Planning        ← Text updated
└─ [Mobile app support] [Dark mode] [Voice commands]

[Status: Saved] [←→:Select] [↓:Focus] [↑:Parent] [Tab:Add Child]
```

**3b. Alternatively, user presses Esc to cancel:**
```
ROOT > Project Ideas
● Feature Requests        ← Original text restored
└─ [Mobile app support] [Dark mode] [Voice commands]

[Status: Canceled edit] [←→:Select] [↓:Focus] [↑:Parent] [Tab:Add Child]
```

### Adding New Nodes

**1. Adding a child node with Tab while in current node:**
```
ROOT > Project Ideas
● Feature Requests
└─ [Mobile app support] [Dark mode] [Voice commands]

[Status: Ready] [←→:Select] [↓:Focus] [↑:Parent] [Tab:Add Child]
```

**2. User presses Tab, creating a new child:**
```
ROOT > Project Ideas
● Feature Requests
└─ [Mobile app support] [Dark mode] [Voice commands] [|] ← New child

[Status: Editing new node] [Enter:Save] [Esc:Cancel]
```

**3. Focusing on a child and adding a new child to it:**
```
ROOT > Project Ideas
● Feature Requests
└─ [Mobile app support] [Dark mode] [Voice commands]

[Status: Ready] [←→:Select] [↓:Focus] [↑:Parent]
```

**4. User presses Down arrow to focus the selected child:**
```
ROOT > Project Ideas > Feature Requests
● Mobile app support
└─ [No children]    ← No children yet

[Status: Ready] [Tab:Add Child] [Enter:Add Sibling]
```

**5. User presses Tab to add a child to the focused node:**
```
ROOT > Project Ideas > Feature Requests
● Mobile app support
└─ [|]              ← New child being edited

[Status: Editing new node] [Enter:Save] [Esc:Cancel]
```

### Deleting Nodes

**1. User selects a child and presses Delete:**
```
ROOT > Project Ideas
● Feature Requests
└─ [Mobile app support] [Dark mode] [Voice commands]

[Status: Delete?] [Y:Confirm] [N:Cancel]
```

**2. User confirms deletion:**
```
ROOT > Project Ideas
● Feature Requests
└─ [Mobile app support] [Voice commands]   ← Selection moves to previous sibling

[Status: Node deleted] [←→:Select] [↓:Focus] [↑:Parent]
```

## Special Features

### Auto-saving

- Changes saved automatically after:
  - Node text edits (on commit)
  - Node structure changes (add/delete)
  - Navigation events (configurable delay)
- Status indicator shows save state:
  - "Saved" (green)
  - "Saving..." (yellow)
  - "Unsaved Changes" (red)

### Viewport Management

- Children view adapts to terminal width
- Windowed pagination for handling many siblings
- Position indicators provide spatial awareness
- Smart scrolling keeps selected child in view when navigating
- Handles terminal resize events gracefully

### Visual Enhancements

- Use colors consistently for information hierarchy
- Primary theme colors:
  - Current node: Bright white
  - Selection: Cyan background
  - Breadcrumbs: Gray to white gradient
  - Pagination indicators: Yellow
  - Position counters: Light gray
  - Status: Green/Yellow/Red
  - Hotkeys: Cyan
- Support for custom color themes

### Example States

**Root Node View:**
```
● My Mindmap
└─ [Project Ideas] [Reading List] [Personal Goals]

[Status: Ready] [←→:Select] [↓:Focus] [Tab:Add Child]
```

**Deeply Nested Node:**
```
ROOT > ... > Project Ideas > Web Apps
● Interactive Tutorial
└─ [User Authentication] [Progress Tracking] [Certificate Generation]

[Status: Ready] [^C:Quit] [↑↓←→:Navigate] [/:Search]
```

**Editing Node:**
```
ROOT > ... > Reading List
● Science Fiction Novels|
└─ [Dune] [Foundation] [Neuromancer]

[Status: Editing] [Enter:Save] [Esc:Cancel]
```

**Delete Confirmation:**
```
ROOT > ... > Personal Goals
● Learn Spanish
└─ [Daily Practice] [Find Tutor] [Delete? y/n] [Travel to Spain]

[Status: Confirm Delete] [Y:Confirm] [N:Cancel]
```

## Implementation Guidelines

1. Use a single-screen approach that updates in-place
2. Update only changed components for performance
3. Cache rendered components when appropriate
4. Use Rich library's minimal components (avoid full Textual widgets)
5. Implement responsive handling of terminal resize events
6. Test with various terminal types and sizes
7. Keep the rendering loop simple and performant

## Accessibility Considerations

1. Ensure color schemes have sufficient contrast
2. Provide alternative navigation options (arrows and letter keys)
3. Support screenreader-friendly mode
4. Allow customization of visual elements
5. Test with terminal magnification tools

By embracing these design principles, Quick Mode will deliver a lightning-fast, keyboard-driven mindmapping experience that feels like an extension of the user's thought process.
