# Edit Mode (TUI) Implementation Checklist

This checklist tracks the step-by-step plan for implementing the new edit mode in `mdbub`, using Textual and textual-canvas.

---

- [x] **1. Scaffold TUI module structure**
    - Create `src/mdbub/editmode/` (or `tui/`) directory
    - Add initial files: `app.py`, `canvas_view.py`, `tree_view.py`, `hotkey_manager.py`, `themes/`
- [x] **2. Minimal Textual app**
    - App launches with placeholder for both views
    - CLI entrypoint (`edit.py`) launches the app
- [x] **3. Hotkey integration**
    - Load hotkeys from `hotkeys.py` (and config if present)
    - Map to Textual key bindings
- [x] **4. View switching**
    - Implement hotkey to toggle between canvas and tree views
    - Maintain shared selection state
- [ ] **5. Theming**
    - Add default theme (Textual CSS)
    - Ensure widgets and canvas respect the theme
- [ ] **6. Canvas view basics**
    - Use textual-canvas for node/link visualization
    - Display mindmap nodes in freeform layout
- [ ] **7. Tree view basics**
    - Sidebar/tree widget for Ranger-like navigation
    - Keyboard navigation for nodes
- [ ] **8. Advanced features groundwork**
    - Animation hooks for node movement
    - Theme switching support
    - Prepare for future tagging/search/fold

---

**Mark each step as complete (`[x]`) as you finish.**


# 3-Column Ranger View Implementation Checklist

**NEW: True Ranger-Style Column Logic**

- [x] Step 1: Scaffold RangerView as a Horizontal container with 3 columns (breadcrumbs, siblings, children)
- [ ] Step 2: Refactor to path-based navigation:
    - Track a `selected_path` (list of indices from root) instead of a single selected node.
    - Left column: Breadcrumbs (root → ... → current node)
    - Middle column: Children of the node at the end of the path (selectable)
    - Right column: Children of the currently selected child in the middle column (or hidden if none)
    - Navigation keys update the path and columns accordingly
- [ ] Step 3: Hide rightmost column if selected node has no children
- [ ] Step 4: Ensure navigation and column updates match desired UX
- [ ] Step 5: Add tests for path-based navigation and column extraction
- [ ] Step 6: Integrate with status bar and canvas view
- [ ] Step 7: Add message/event system to notify other views/widgets of selection changes

---
