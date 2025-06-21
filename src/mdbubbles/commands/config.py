from datetime import datetime

import typer

from mdbub.config import get_hotkey_config_path, get_theme_css_path, get_xdg_dir


def main(
    remove: bool = typer.Option(
        False, "--remove", help="Remove (backup) custom config files"
    ),
    list_backups: bool = typer.Option(
        False, "--list-backups", help="List existing backup files"
    ),
    restore: str = typer.Option(
        None, "--restore", help="Restore from backup file (specify backup filename)"
    ),
):
    """Initialize configuration directories and files, or manage config backups."""

    if list_backups:
        list_backup_files()
    elif remove:
        remove_configs()
    elif restore:
        restore_config(restore)
    else:
        init_configs()


def remove_configs():
    """Remove custom configs by backing them up with .bak extension."""
    typer.echo("🗑️  Removing custom configuration files...")

    config_dir = get_xdg_dir("config")
    hotkey_config_path = get_hotkey_config_path()
    theme_config_path = config_dir / "theme.tcss"

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    removed_count = 0

    # Backup hotkeys config
    if hotkey_config_path.exists():
        backup_path = hotkey_config_path.with_suffix(f".{timestamp}.bak")
        hotkey_config_path.rename(backup_path)
        typer.echo(f"📦 Backed up hotkeys config: {hotkey_config_path} → {backup_path}")
        removed_count += 1
    else:
        typer.echo(f"📄 No custom hotkeys config found: {hotkey_config_path}")

    # Backup theme config
    if theme_config_path.exists():
        backup_path = theme_config_path.with_suffix(f".{timestamp}.bak")
        theme_config_path.rename(backup_path)
        typer.echo(f"🎨 Backed up theme config: {theme_config_path} → {backup_path}")
        removed_count += 1
    else:
        typer.echo(f"📄 No custom theme config found: {theme_config_path}")

    typer.echo("")
    if removed_count > 0:
        typer.echo(f"✅ Backed up {removed_count} custom config file(s)")
        typer.echo("💡 mdbub will now use built-in defaults")
        typer.echo("💡 To restore: rename .bak files back to original names")
    else:
        typer.echo("📁 No custom config files found to remove")

    typer.echo("Run 'mdbub version' to see current configuration status.")


def list_backup_files():
    """List existing backup config files."""
    typer.echo("📋 Listing backup config files...")

    config_dir = get_xdg_dir("config")

    # Find backup files
    backup_files = []
    for pattern in ["*.bak", "hotkeys.*.bak", "theme.*.bak"]:
        backup_files.extend(config_dir.glob(pattern))

    if backup_files:
        typer.echo(f"Found {len(backup_files)} backup file(s):")
        for backup_file in sorted(backup_files):
            # Get file info
            size = backup_file.stat().st_size
            mtime = datetime.fromtimestamp(backup_file.stat().st_mtime)
            typer.echo(f"  📦 {backup_file.name}")
            typer.echo(
                f"      Size: {size} bytes, Modified: {mtime.strftime('%Y-%m-%d %H:%M:%S')}"
            )

        typer.echo("")
        typer.echo("💡 To restore a backup:")
        typer.echo("   cp backup_file.bak original_name")
        typer.echo("   # Example: cp hotkeys.20250613_143022.bak hotkeys.toml")
    else:
        typer.echo("📁 No backup files found in config directory")
        typer.echo(f"   Directory: {config_dir}")


def restore_config(backup_filename: str):
    """Restore configuration from a backup file."""
    typer.echo(f"🔄 Restoring config from backup: {backup_filename}")

    config_dir = get_xdg_dir("config")
    backup_path = config_dir / backup_filename

    if not backup_path.exists():
        typer.echo(f"❌ Backup file not found: {backup_path}")
        typer.echo("💡 Use 'mdbub config --list-backups' to see available backups")
        return

    # Determine the original filename based on backup name
    original_name = None
    if backup_filename.startswith("hotkeys.") and backup_filename.endswith(".bak"):
        original_name = "hotkeys.toml"
    elif backup_filename.startswith("theme.") and backup_filename.endswith(".bak"):
        original_name = "theme.tcss"
    else:
        # Try to guess from the filename
        if "hotkeys" in backup_filename:
            original_name = "hotkeys.toml"
        elif "theme" in backup_filename:
            original_name = "theme.tcss"
        else:
            typer.echo(f"❌ Cannot determine original filename for: {backup_filename}")
            typer.echo("💡 Manually copy the backup file to the correct name:")
            typer.echo(f"   cp {backup_path} {config_dir}/hotkeys.toml")
            typer.echo("   # or")
            typer.echo(f"   cp {backup_path} {config_dir}/theme.tcss")
            return

    original_path = config_dir / original_name

    # Check if current config exists and create backup
    if original_path.exists():
        current_backup = original_path.with_suffix(
            f".current_{datetime.now().strftime('%Y%m%d_%H%M%S')}.bak"
        )
        original_path.rename(current_backup)
        typer.echo(f"📦 Backed up current config: {original_path} → {current_backup}")

    # Restore from backup
    backup_path.rename(original_path)
    typer.echo(f"✅ Restored config: {backup_filename} → {original_name}")
    typer.echo("💡 Run 'mdbub version' to verify the restoration")


def init_configs():
    """Initialize configuration directories and files."""
    typer.echo("🔧 Initializing mdbub configuration...")

    # Create config directories
    config_dir = get_xdg_dir("config")
    data_dir = get_xdg_dir("data")
    cache_dir = get_xdg_dir("cache")

    for dir_path, name in [
        (config_dir, "config"),
        (data_dir, "data"),
        (cache_dir, "cache"),
    ]:
        if not dir_path.exists():
            dir_path.mkdir(parents=True, exist_ok=True)
            typer.echo(f"✅ Created {name} directory: {dir_path}")
        else:
            typer.echo(f"📁 {name} directory exists: {dir_path}")

    # Create default hotkeys config if it doesn't exist
    hotkey_config_path = get_hotkey_config_path()
    if not hotkey_config_path.exists():
        default_config = """# mdbub hotkeys configuration
# Customize your keyboard shortcuts here
# 
# Format:
# [section_name]
# action_name = "key_combination"
#
# Example customizations:
# [navigation]
# focus_tree = "ctrl+t"
# focus_editor = "ctrl+e"
#
# [editing]
# save_file = "ctrl+s"
# quit_app = "ctrl+q"
#
# See the full list of available actions in the documentation
# or by running: mdbub version

[navigation]
# Uncomment and modify these to customize navigation hotkeys
# focus_tree = "ctrl+t"
# focus_editor = "ctrl+e"

[editing]
# Uncomment and modify these to customize editing hotkeys
# save_file = "ctrl+s"
# new_node = "ctrl+n"
"""

        hotkey_config_path.write_text(default_config)
        typer.echo(f"✅ Created default hotkeys config: {hotkey_config_path}")
        typer.echo("💡 Edit this file to customize your hotkeys")
    else:
        typer.echo(f"📄 Hotkeys config exists: {hotkey_config_path}")

    # Create default theme config if it doesn't exist
    theme_config_path = config_dir / "theme.tcss"
    if not theme_config_path.exists():
        # Copy the built-in theme as a starting point
        try:
            built_in_theme = get_theme_css_path()
            if built_in_theme.exists():
                theme_content = built_in_theme.read_text()
                # Add header comment
                theme_content = (
                    """/* mdbub custom theme
 * This is a copy of the built-in theme for customization
 * Modify colors, fonts, spacing, etc. to your liking
 * 
 * Textual CSS documentation: https://textual.textualize.io/guide/CSS/
 */

"""
                    + theme_content
                )
                theme_config_path.write_text(theme_content)
                typer.echo(f"✅ Created custom theme template: {theme_config_path}")
                typer.echo("💡 Edit this file to customize colors and styling")
            else:
                typer.echo("⚠️  Could not find built-in theme to copy")
                typer.echo(f"💡 Create {theme_config_path} manually for custom styling")
        except Exception as e:
            typer.echo(f"⚠️  Could not create theme config: {e}")
            typer.echo(f"💡 Create {theme_config_path} manually for custom styling")
    else:
        typer.echo(f"🎨 Custom theme exists: {theme_config_path}")

    typer.echo("")
    typer.echo("🎉 Configuration initialization complete!")
    typer.echo("Run 'mdbub version' to see your configuration status.")
