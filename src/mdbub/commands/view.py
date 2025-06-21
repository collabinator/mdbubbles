import typer

app = typer.Typer()


@app.command()
def main(filename: str):
    """Render mindmap as ASCII/Unicode tree (stub)."""
    typer.echo(f"[view] Would render {filename} (stub)")
