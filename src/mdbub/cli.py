import typer
from rich.console import Console
from rich.table import Table
from mdbub import BUILD_INFO
from mdbub import __version__ as VERSION
from mdbub.commands.tag_utils import extract_tags_from_file

from mdbub.commands import about, version
from mdbub.commands.quick import main as quick_main

app = typer.Typer(
    help="""
    mdbub: Interactive mindmap CLI tool.

    Usage examples:
      poetry run mdbub FILE.md
      poetry run mdbub --print-tags FILE.md
      poetry run mdbub --version
      poetry run mdbub --about

    [bold yellow]Note:[/bold yellow] Options like --print-tags must come before the filename.
    If you do not provide a filename, the last session will be restored (if available).
    """,
    add_completion=False,
    invoke_without_command=True,
)

@app.callback(invoke_without_command=True)
def main(
    ctx: typer.Context,
    file: str = typer.Argument(
        None,
        help="""
        Markdown mindmap file to open or create (append #path to open to a node with [id:path]).
        [bold yellow]Options like --print-tags must come before the filename.[/bold yellow]
        """,
    ),
    print_tags: bool = typer.Option(
        False, "--print-tags", help="Print all #tags in the [FILE] as a table and exit."
    ),
    kv_list: bool = typer.Option(
        False,
        "--kv-list",
        help="Print all @key:value metadata in the [FILE] as a table and exit.",
    ),
    version_flag: bool = typer.Option(
        False, "--version", help="Show version, build info, and config path."
    ),
    about_flag: bool = typer.Option(False, "--about", help="Show about info."),
):
    """
    Quick mode: mini interactive shell (default).
    Use --version for version info, --config for config management.
    """
    if version_flag:
        version()
        raise typer.Exit()
    if about_flag:
        about.main()
        raise typer.Exit()
    if ctx.invoked_subcommand is None:
        try:
            # Support deep links: filename.md#path/to/node
            if file is not None and "#" in file:
                filename, deep_link = file.split("#", 1)
                deep_link_path = (
                    deep_link.strip("/").split("/") if deep_link.strip("/") else []
                )
                file = filename
            else:
                deep_link_path = None
            if file is not None:
                console = Console()
                if print_tags:
                    tag_counts, tag_lines = extract_tags_from_file(file)
                    if not tag_counts:
                        console.print(
                            f"[bold red]No tags found in:[/bold red] [italic]{file}[/italic]"
                        )
                        raise typer.Exit(0)
                    table = Table(title=f"Tags in {file}", show_lines=True)
                    table.add_column("Tag", style="cyan", no_wrap=True)
                    table.add_column("Count", style="magenta", justify="right")
                    table.add_column("Lines", style="dim")
                    for tag in sorted(tag_counts):
                        # Deduplicate and sort line numbers
                        unique_lines = sorted(set(tag_lines[tag]))
                        lines = ", ".join(str(n) for n in unique_lines)
                        table.add_row(f"#{tag}", str(tag_counts[tag]), lines)
                    console.print(table)
                    return
                if kv_list:
                    from mdbub.commands.kv_utils import extract_kv_metadata_from_file

                    node_kvs, all_keys, value_counts = extract_kv_metadata_from_file(
                        file
                    )
                    if not node_kvs:
                        console.print(
                            f"[yellow]No @key:value metadata found in:[/yellow] [italic]{file}[/italic]"
                        )
                        return
                    table = Table(
                        title=f"@key:value metadata in {file}", show_lines=True
                    )
                    table.add_column("Line", style="dim", justify="right")
                    table.add_column("Node Label", style="cyan")
                    for key in all_keys:
                        table.add_column(f"@{key}", style="magenta")
                    for node in node_kvs:
                        row = [str(node["line"]), node["label"]]
                        for key in all_keys:
                            row.append(node["kvs"].get(key, ""))
                        table.add_row(*row)
                    console.print(table)
                    # Print summary
                    console.print(
                        "\n[bold yellow]Summary of value counts per key:[/bold yellow]"
                    )
                    for key in all_keys:
                        vc = value_counts[key]
                        summary = ", ".join(
                            f"{v} ({c})"
                            for v, c in sorted(vc.items(), key=lambda x: (-x[1], x[0]))
                        )
                        console.print(f"  [cyan]@{key}[/cyan]: {summary}")
                    return
                file_obj = open(file, "r+")
            else:
                file_obj = None
            quick_main(
                file_obj,
                VERSION,
                BUILD_INFO,
                deep_link_path=deep_link_path,
            )
        except Exception as e:
            typer.echo(f"Error: {e}")
            raise typer.Exit(1)


if __name__ == "__main__":
    app()
