# CLI entry for mdbubbles (edit mode)
import typer

from mdbubbles.commands.edit import edit_main

app = typer.Typer(help="mdbubbles: Rich TUI mindmap editor")


@app.command()
def edit(
    file: str = typer.Argument(..., help="Markdown mindmap file to open or create."),
    config_flag: bool = typer.Option(
        False, "--config", help="Initialize configuration files and directories."
    ),
    remove: bool = typer.Option(
        False,
        "--remove",
        help="Remove (backup) custom config files",
        show_default=False,
    ),
    list_backups: bool = typer.Option(
        False, "--list-backups", help="List existing backup files", show_default=False
    ),
    restore: str = typer.Option(
        None,
        "--restore",
        help="Restore from backup file (specify backup filename)",
        show_default=False,
    ),
    debug: bool = typer.Option(
        False, "--debug", help="Enable debug mode with extra info in view columns."
    ),
):

    if config_flag:
        config.main(remove=remove, list_backups=list_backups, restore=restore)
        raise typer.Exit()
    if file is None:
        typer.echo("Error: Please provide a markdown mindmap file to open or create.")
        raise typer.Exit(1)
    try:
        with open(file, "r+") as f:
            edit_main(f, debug=debug)
    except FileNotFoundError:
        with open(file, "w+") as f:
            edit_main(f, debug=debug)


if __name__ == "__main__":
    app()
