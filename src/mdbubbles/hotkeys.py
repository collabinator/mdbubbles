# Centralized hotkey definitions for mdbub TUI
# Each section is a list of dicts: {action, label, default}

HOTKEYS_EDIT = {
    "general": [
        {"action": "save", "label": "Save", "default": "ctrl+s"},
        {"action": "quit", "label": "Quit", "default": "ctrl+d"},
        {"action": "quit_alt1", "label": "Quit (alt)", "default": "ctrl+q"},
        {"action": "show_help", "label": "Show help", "default": "question_mark"},
    ],
    "navigation": [
        {"action": "up", "label": "Up", "default": "up"},
        {"action": "up_alt", "label": "Up (alt)", "default": "w"},
        {"action": "down", "label": "Down", "default": "down"},
        {"action": "down_alt", "label": "Down (alt)", "default": "s"},
        {"action": "left", "label": "Left", "default": "left"},
        {"action": "left_alt", "label": "Left (alt)", "default": "a"},
        {"action": "right", "label": "Right", "default": "right"},
        {"action": "right_alt", "label": "Right (alt)", "default": "d"},
    ],
    "view": [
        {"action": "fold", "label": "Fold", "default": "left_square_bracket"},
        {"action": "unfold", "label": "Unfold", "default": "right_square_bracket"},
        {"action": "fold_all", "label": "Fold all", "default": "left_curly_bracket"},
        {
            "action": "unfold_all",
            "label": "Unfold all",
            "default": "right_curly_bracket",
        },
        {"action": "switch_to_tab1", "label": "Switch to tab 1", "default": "alt+1"},
        {"action": "switch_to_tab2", "label": "Switch to tab 2", "default": "alt+2"},
        {"action": "switch_to_tab3", "label": "Switch to tab 3", "default": "alt+3"},
        {"action": "switch_to_tab4", "label": "Switch to tab 4", "default": "alt+4"},
        {"action": "switch_to_tab5", "label": "Switch to tab 5", "default": "alt+5"},
        {"action": "switch_to_tab6", "label": "Switch to tab 6", "default": "alt+6"},
        {"action": "switch_to_tab7", "label": "Switch to tab 7", "default": "alt+7"},
        {"action": "switch_to_tab8", "label": "Switch to tab 8", "default": "alt+8"},
        {"action": "switch_to_tab9", "label": "Switch to tab 9", "default": "alt+9"},
        {"action": "toggle_view_type", "label": "Toggle view type", "default": "tilde"},
    ],
    "edit_nodes": [
        {"action": "add_child", "label": "Add child", "default": "tab"},
        {"action": "add_sibling", "label": "Add sibling", "default": "enter"},
        {"action": "delete_node", "label": "Delete node", "default": "delete"},
        {
            "action": "delete_node_alt",
            "label": "Delete node (alt)",
            "default": "backspace",
        },
        {"action": "move_node_up", "label": "Move up", "default": "alt+ctrl+up"},
        {"action": "move_node_down", "label": "Move down", "default": "alt+ctrl+down"},
        {"action": "move_node_left", "label": "Move left", "default": "alt+ctrl+left"},
        {
            "action": "move_node_right",
            "label": "Move right",
            "default": "alt+ctrl+right",
        },
        {"action": "edit_node_label", "label": "Edit label", "default": "e"},
        {"action": "insert_mode", "label": "Insert mode", "default": "i"},
        {"action": "confirm_edit", "label": "Confirm edit", "default": "enter"},
        {"action": "cancel_edit", "label": "Cancel edit", "default": "escape"},
    ],
}


def get_hotkey_for_editmode_action(action, hotkey_map=None):
    """
    Return the current key for a given action from the loaded hotkey map.
    If hotkey_map is None, uses the global current_hotkeys_edit.
    """
    if hotkey_map is None:
        hotkey_map = current_hotkeys_edit
    for section in HOTKEYS_EDIT.values():
        for entry in section:
            if entry["action"] == action:
                return hotkey_map.get(action, entry["default"])
    return None


def get_hotkeys_list_for_editmode_section(section, hotkey_map=None):
    """
    Return a list of (label, key) tuples for a section, using loaded values.
    If hotkey_map is None, uses the global current_hotkeys_edit.
    """
    if hotkey_map is None:
        hotkey_map = current_hotkeys_edit
    result = []
    for entry in HOTKEYS_EDIT.get(section, []):
        key = hotkey_map.get(entry["action"], entry["default"])
        result.append((entry["label"], key))
    return result
