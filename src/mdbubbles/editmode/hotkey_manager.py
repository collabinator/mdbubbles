# mdbubbles.editmode.hotkey_manager - copy of mdbub.editmode.hotkey_manager
class HotkeyManager:
    def __init__(self):
        self.hotkeys = {}
        # TODO: Populate hotkeys

    def get_key(self, action):
        return self.hotkeys.get(action)

    def get_all_bindings(self):
        return self.hotkeys.items()
