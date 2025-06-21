# mdbubbles.editmode.tree_view - copy of mdbub.editmode.tree_view
from textual.widgets import Static


class RangerView(Static):
    def __init__(self, root_node, view_debug=False, logger=None):
        super().__init__()
        self.root_node = root_node
        self.view_debug = view_debug
        self.logger = logger
        # TODO: Implement tree view logic for mindmap navigation
