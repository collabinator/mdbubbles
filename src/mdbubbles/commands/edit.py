# mdbubbles edit command module - copy of mdbub.commands.edit
import logging
import os
import sys


def setup_app_logger(logfile="mdbubbles_debug.log"):
    logger = logging.getLogger("mdbubbles.editmode")
    logger.setLevel(logging.DEBUG)
    fh = logging.FileHandler(logfile, encoding="utf-8")
    fh.setLevel(logging.DEBUG)
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    logger.info("MDBubbles app-wide logging is active!")
    return logger


def edit_main(file, debug=False):
    """Launch edit mode for a mindmap file."""
    logger = setup_app_logger()
    if not os.path.exists(file):
        with open(file, "w+") as f:
            f.write("- Root\n")
    with open(file, "r+") as f:
        markdown_text = f.read()
    try:
        from mdbubbles.editmode.app import EditModeApp
    except ImportError as e:
        print(f"Error: {e}")
        sys.exit(1)

    app = EditModeApp(
        markdown_text=markdown_text,
        view_debug=debug,
        logger=logger,
        file_path=file,  # Enable autosave to the original file
        autosave=True,
    )
    app.run()
