# mdbubbles.editmode.breadcrumb_bar - copy of mdbub.editmode.breadcrumb_bar
from textual.widgets import Static


class BreadcrumbBar(Static):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.path = []

    def update_path(self, path):
        self.path = path
        self.update(self.render_path())

    def render_path(self):
        # TODO: Implement actual rendering logic for breadcrumbs
        return " > ".join(self.path)
