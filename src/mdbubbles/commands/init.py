import typer

app = typer.Typer()


@app.command()
def main(filename: str):
    """Initialize a new mindmap markdown file."""
    import pathlib

    path = pathlib.Path(filename)
    if path.exists():
        typer.echo(f"Error: {filename} already exists.", err=True)
        raise typer.Exit(1)
    template = """# Mind Map\n\n- Root Node\n  - Child 1\n  - Child 2\n\n---\n\n<!-- mdbub-format -->\n```yaml\nversion: 1.0\ndictionary:\n  node:\n    label: string\n    color?: string\n    icon?: string\ncontent:\n  type: list\n  mapping: markdown-list\n```\n"""
    path.write_text(template)
    typer.echo(f"Created new mindmap file: {filename}")
