# mdbubbles.editmode.app - copy of mdbub.editmode.app
import logging

from textual.app import App, ComposeResult
from textual.widgets import Static

from mdbubbles.config import get_theme_css_path
from mdbubbles.core.mindmap import mindmap_to_markdown, parse_markdown_to_mindmap
from mdbubbles.editmode.breadcrumb_bar import BreadcrumbBar
from mdbubbles.editmode.canvas_view import CanvasView
from mdbubbles.editmode.hotkey_manager import HotkeyManager
from mdbubbles.editmode.status_bar import StatusBar
from mdbubbles.editmode.tree_view import RangerView


class EditModeApp(App):
    """Main Textual application for mdbubbles edit mode."""

    CSS_PATH = str(get_theme_css_path())

    def __init__(
        self,
        markdown_text=None,
        view_debug=False,
        logger=None,
        start_view="canvas",
        file_path=None,
        autosave=True,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self.view_debug = view_debug
        self.logger = logger or logging.getLogger("mdbubbles.editmode")
        if self.view_debug:
            self.logger.info(f"[DEBUG][App.__init__] view_debug={self.view_debug}")
        self.hotkeys = HotkeyManager()
        self.current_view = start_view  # "canvas" or "tree"
        self.root_node = parse_markdown_to_mindmap(markdown_text or "- Root")
        self.file_path = file_path  # Path to save changes to
        self.autosave = autosave  # Whether to automatically save changes
        self.is_dirty = False  # Track if changes need saving
        self.canvas_widget = CanvasView(self.root_node, view_debug=view_debug)
        self.tree_widget = RangerView(
            self.root_node, view_debug=self.view_debug, logger=self.logger
        )
        self.breadcrumb_bar = BreadcrumbBar(classes="breadcrumb-bar")
        self.status = StatusBar(self._status_text())

    def compose(self) -> ComposeResult:
        if self.current_view == "canvas":
            yield self.canvas_widget
        elif self.current_view == "tree":
            yield self.tree_widget
        yield self.breadcrumb_bar
        yield self.status

    async def on_mount(self):
        global_actions = ["quit", "quit_alt1", "show_help", "toggle_view_type", "save"]
        for action in global_actions:
            key = self.hotkeys.get_key(action)
            if key and hasattr(self, f"action_{action}"):
                self.bind(key, action)
        if self.current_view == "canvas":
            self.set_focus(self.canvas_widget)
        elif self.current_view == "tree":
            self.set_focus(self.tree_widget)
            if hasattr(self.tree_widget, "_get_breadcrumb_path"):
                initial_path = self.tree_widget._get_breadcrumb_path()
                self.breadcrumb_bar.update_path(initial_path)

    def _status_text(self):
        if self.view_debug:
            selected_node = None
            if self.current_view == "tree" and hasattr(
                self.tree_widget, "get_selected_node"
            ):
                selected_node = self.tree_widget.get_selected_node()
            node_info = f" | Selected: {selected_node}" if selected_node else ""
            return f"{self.current_view.upper()}{node_info} | File: {self.file_path} | Press ~ to switch view type | ? for help | ctrl+d or ctrl+q to quit"
        else:
            return f"{self.current_view.upper()} | File: {self.file_path} | Press ~ to switch view type | ? for help | ctrl+d or ctrl+q to quit"

    async def action_switch_to_tree(self):
        if self.view_debug:
            self.logger.info("[DEBUG][App] action_switch_to_tree called")
        # Change view and recompose
        self.current_view = "tree"
        await self.compose()
        self.set_focus(self.tree_widget)
        if hasattr(self.tree_widget, "_get_breadcrumb_path"):
            initial_path = self.tree_widget._get_breadcrumb_path()
            self.breadcrumb_bar.update_path(initial_path)
        self.status.update_status(self._status_text())

    async def action_switch_to_canvas(self):
        if self.view_debug:
            self.logger.info("[DEBUG][App] action_switch_to_canvas called")
        self.current_view = "canvas"
        await self.compose()
        self.set_focus(self.canvas_widget)
        self.status.update_status(self._status_text())

    def on_ranger_view_path_changed(self, event: RangerView.PathChanged) -> None:
        self.breadcrumb_bar.update_path(event.path)
        self.status.update_status(self._status_text())

    def on_label_edit_popup_edit_completed(self, event):
        if self.current_view == "tree" and hasattr(
            self.tree_widget, "on_label_edit_popup_edit_completed"
        ):
            self.tree_widget.on_label_edit_popup_edit_completed(event)
            if not event.cancelled:
                self.mark_dirty()

    def start_label_edit(self, node, initial_text: str, insert_mode: bool = False):
        from mdbubbles.editmode.label_editor import (  # local import to avoid cycle
            LabelEditorModal,
        )

        modal = LabelEditorModal(initial_text, insert_mode)
        self.push_screen(modal)
        return modal

    def on_label_editor_modal_edit_completed(self, event):
        self.on_label_edit_popup_edit_completed(event)

    def save_to_file(self, force=False):
        if not self.file_path:
            if self.view_debug:
                self.logger.info("[DEBUG] No file path set, cannot save")
            return False
        if not self.is_dirty and not force:
            if self.view_debug:
                self.logger.info("[DEBUG] No changes to save")
            return True
        try:
            markdown_content = mindmap_to_markdown(self.root_node)
            with open(self.file_path, "w", encoding="utf-8") as f:
                f.write(markdown_content)
            self.is_dirty = False
            if self.view_debug:
                self.logger.info(f"[DEBUG] Saved to {self.file_path}")
            return True
        except Exception as e:
            if self.view_debug:
                self.logger.error(f"[DEBUG] Failed to save: {e}")
            return False

    def mark_dirty(self):
        self.is_dirty = True
        if self.autosave and self.file_path:
            if hasattr(self, "_autosave_timer") and self._autosave_timer:
                self._autosave_timer.stop()
            self._autosave_timer = self.set_timer(0.5, self.save_to_file)

    def action_save(self):
        success = self.save_to_file(force=True)
        if success and self.view_debug:
            self.logger.info("[DEBUG] Manual save completed")
        return success
