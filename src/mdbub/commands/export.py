import typer

app = typer.Typer()


@app.command()
def main(filename: str, format: str = "json"):
    """Export mindmap to various formats (stub)."""
    typer.echo(f"[export] Would export {filename} as {format} (stub)")
