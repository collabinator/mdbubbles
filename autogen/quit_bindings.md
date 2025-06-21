# Quit Bindings in mdbub Edit Mode

This document describes the available ways to quit the mdbub TUI application.

## Available Quit Bindings

The following key combinations will quit the application:

- **Ctrl+D** - Primary quit binding (original)
- **Ctrl+Q** - Alternative quit binding (added for convenience)

## Rationale for Limited Quit Bindings

We deliberately chose NOT to bind common keys like:
- `q` - Would interfere with typing 'q' when editing node labels
- `Escape` - Commonly used to cancel editing operations
- `:q` - Would require command mode implementation

## Future Considerations

When text editing functionality is fully implemented, we may consider:
- Adding contextual quit bindings (e.g., `q` only when not editing)
- Implementing a command mode for `:q` style commands
- Adding confirmation dialogs for quit actions

## Implementation

The quit bindings are defined in:
- `src/mdbub/hotkeys.py` - Hotkey definitions
- `src/mdbub/editmode/app.py` - Action handlers
