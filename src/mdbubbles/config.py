import os
import sys
from pathlib import Path

import toml

from .hotkeys import HOTKEYS_EDIT

XDG_DEFAULTS = {
    "config": ("XDG_CONFIG_HOME", ".config"),
    "data": ("XDG_DATA_HOME", ".local/share"),
    "cache": ("XDG_CACHE_HOME", ".cache"),
}

APPNAME = "mdbub"


def get_theme_css_path() -> Path:
    """Return the path to the theme CSS file: user config theme if present, else built-in default."""
    user_theme = get_xdg_dir("config") / "theme.tcss"
    if user_theme.exists():
        return user_theme
    # fallback to built-in theme
    return Path(__file__).parent / "themes" / "default.tcss"


def get_xdg_dir(kind: str) -> Path:
    """Return the XDG-compliant directory for config/data/cache."""
    env_var, fallback = XDG_DEFAULTS[kind]
    if sys.platform.startswith("win"):
        if kind == "config":
            return (
                Path(os.environ.get("APPDATA", Path.home() / "AppData" / "Roaming"))
                / APPNAME
            )
        elif kind == "data":
            return (
                Path(os.environ.get("APPDATA", Path.home() / "AppData" / "Roaming"))
                / APPNAME
                / "data"
            )
        elif kind == "cache":
            return (
                Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
                / APPNAME
                / "cache"
            )
    base = os.environ.get(env_var)
    if base:
        return Path(base) / APPNAME
    return Path.home() / fallback / APPNAME


def get_hotkey_config_path() -> Path:
    return get_xdg_dir("config") / "hotkeys.toml"


def load_hotkey_config():
    config_path = get_hotkey_config_path()
    user_overrides = {}
    if config_path.exists():
        try:
            user_overrides = toml.load(config_path)
        except Exception:
            user_overrides = {}
    # Build a flat action->key map
    flat_map = {}
    grouped = {}
    for section, entries in HOTKEYS_EDIT.items():
        grouped[section] = []
        for entry in entries:
            action = entry["action"]
            # User override: config[section][action] or config[action]
            user_key = None
            if section in user_overrides and action in user_overrides[section]:
                user_key = user_overrides[section][action]
            elif action in user_overrides:
                user_key = user_overrides[action]
            key = user_key if user_key else entry["default"]
            flat_map[action] = key
            grouped[section].append({**entry, "key": key})
    # Set the current hotkey map to the merged result
    import mdbub.hotkeys as hotkeys  # ensure correct import for assignment

    hotkeys.current_hotkeys_edit = (
        grouped  # grouped is the live, possibly user-overridden, hotkey map
    )
    return flat_map, grouped
