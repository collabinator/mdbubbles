# Configuration Management

mdbub provides comprehensive configuration management with backup and restore capabilities.

## Configuration Files

mdbub stores configuration in XDG-compliant directories:

- **Linux/macOS**: `~/.config/mdbub/`
- **Windows**: `%APPDATA%\mdbub\`

### Config Files:
- `hotkeys.toml` - Custom keyboard shortcuts
- `theme.tcss` - Custom UI theme (Textual CSS)

## Commands

### Initialize Configuration
Create default configuration files and directories:
```bash
mdbub config
```

This creates:
- Config directories (if they don't exist)
- Default `hotkeys.toml` with commented examples
- Custom `theme.tcss` based on the built-in theme

### Remove Custom Configurations
Safely remove custom configs by backing them up:
```bash
mdbub config --remove
```

This will:
- Rename config files with timestamp: `hotkeys.20250613_143022.bak`
- Preserve your customizations as backups
- Switch back to built-in defaults

### List Backup Files
See all available backup files:
```bash
mdbub config --list-backups
```

Shows:
- All `.bak` files in config directory
- File sizes and modification dates
- Instructions for manual restoration

### Restore from Backup
Restore a specific backup file:
```bash
mdbub config --restore hotkeys.20250613_143022.bak
```

This will:
- Backup current config (if it exists)
- Restore the specified backup file
- Rename it back to the original filename

## Example Workflow

```bash
# 1. Set up initial config
mdbub config

# 2. Check current status
mdbub version

# 3. Edit your configs
nano ~/.config/mdbub/hotkeys.toml
nano ~/.config/mdbub/theme.tcss

# 4. If you want to reset to defaults
mdbub config --remove

# 5. See what backups exist
mdbub config --list-backups

# 6. Restore a specific backup
mdbub config --restore hotkeys.20250613_143022.bak
```

## Safety Features

- **No data loss**: All removals create timestamped backups
- **Current backup**: Restoring creates backup of current config
- **Smart detection**: Automatically determines original filenames
- **Clear feedback**: Detailed status messages for all operations

## Customization Examples

### Hotkeys (`hotkeys.toml`)
```toml
[navigation]
focus_tree = "ctrl+t"
focus_editor = "ctrl+e"

[editing]
save_file = "ctrl+s"
new_node = "enter"
```

### Theme (`theme.tcss`)
```css
/* Custom dark theme */
App {
    background: #1e1e1e;
    color: #ffffff;
}

Tree {
    background: #252526;
    color: #cccccc;
}
```

See `examples/hotkeys_full_example.toml` for more customization options.
