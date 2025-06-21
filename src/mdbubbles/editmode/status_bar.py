# mdbubbles.editmode.status_bar - copy of mdbub.editmode.status_bar
from textual.widgets import Static


class StatusBar(Static):
    def __init__(self, status_text):
        super().__init__(status_text)
        self.status_text = status_text

    def update_status(self, text):
        self.status_text = text
        self.update(text)
