import platform
import sys
from pathlib import Path

import typer

from mdbubbles import BUILD_INFO, __version__
from mdbubbles.config import get_hotkey_config_path, get_theme_css_path, get_xdg_dir


def main():
    """Print version, build info, and config path."""
    version = __version__
    build_info = BUILD_INFO

    # Rich output with more details
    typer.echo("🧠 mdbubbles - TUI mindmap tool")
    typer.echo("Warning: Alpha version - data may be lost, expect bugs!")
    typer.echo(f"Version: {version}")
    typer.echo(f"Build: {build_info}")
    typer.echo(f"Python: {sys.version.split()[0]} ({platform.python_implementation()})")
    typer.echo(
        f"Platform: {platform.system()} {platform.release()} ({platform.machine()})"
    )
    typer.echo("")

    # Configuration information
    typer.echo("📁 Configuration:")

    # Config directories
    config_dir = get_xdg_dir("config")
    data_dir = get_xdg_dir("data")
    cache_dir = get_xdg_dir("cache")

    typer.echo(f"  Config dir: {config_dir}")
    typer.echo(f"  Data dir:   {data_dir}")
    typer.echo(f"  Cache dir:  {cache_dir}")
    typer.echo("")

    # Specific config files
    typer.echo("🔧 Config files:")

    # Hotkeys config
    hotkey_config_path = get_hotkey_config_path()
    hotkey_exists = hotkey_config_path.exists()
    hotkey_status = "✅ Custom keys" if hotkey_exists else "📄 Using defaults"
    typer.echo(f"  Hotkeys: {hotkey_config_path}")
    typer.echo(f"           {hotkey_status}")

    # Theme config
    theme_path = get_theme_css_path()
    user_theme_path = config_dir / "theme.tcss"
    theme_is_custom = user_theme_path.exists()
    theme_status = "✅ Custom theme" if theme_is_custom else "📄 Built-in theme"
    typer.echo(f"  Theme:   {theme_path}")
    typer.echo(f"           {theme_status}")
    typer.echo("")

    # Installation info
    try:
        import mdbubbles

        install_path = Path(mdbubbles.__file__).parent.parent.parent
        typer.echo(f"📦 Installed at: {install_path}")
    except Exception:
        typer.echo("📦 Installed at: unknown")

    # Config creation hint
    if not hotkey_exists or not theme_is_custom:
        typer.echo("")
        typer.echo("💡 To create override config files:")
        typer.echo("   mdbub config")
        typer.echo("")
