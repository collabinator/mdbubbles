from rich.console import Console


def main():
    """Print about info."""
    console = Console()
    console.print("mdbub: Interactive mindmap CLI tool")
    console.print(
        "It’s built for fast thinkers who love their keyboard. Whether you're capturing a flurry of ideas, organizing research, or mapping out your next big project, `mdbub` is your expressive outlet. It's not just functional, it should feel *fluid*.",
        style="dim cyan",
    )
    console.print(
        "Designed to be delightful to use entirely from the keyboard, this ecosystem lets you think at the speed of thought. And because it’s CLI-native, it’s composable in the best UNIX spirit—ready to interoperate with everything else you do in the shell.",
        style="dim cyan",
    )
    console.print(
        "This is for the chaos-to-clarity thinkers. We’re building it because no other tool feels this good under your fingers.",
        style="dim cyan",
    )
    console.print("")

    # Usage Section
    console.print("[b]USAGE[/b]", style="bold yellow")
    console.print(
        "[b cyan]Basic:[/b cyan]  [dim]mdbub <file.md>[/dim]  — Open or create a mindmap from a Markdown file."
    )
    console.print(
        "[b cyan]Deeplinks:[/b cyan]  [dim]mdbub <file.md>#<nodeid>[/dim]  — Jump directly to a specific node by its link ID."
    )
    console.print(
        "[b cyan]  --> Link IDs: Add \[id:something] for referencing or deep linking.",
        style="dim",
    )
    console.print(
        "[b cyan]Session Restore:[/b cyan]  [dim]mdbub[/dim]  — No file? Your last session is auto-restored (file & node)."
    )
    console.print(
        "[b cyan]Tags:[/b cyan]  Add #tags to node text for fast filtering and organizing."
    )
    console.print(
        "[b cyan]  --> See tag metrics with:[/b cyan] mdbub --print-tags <file.md>.",
        style="dim",
    )
    console.print(
        "[b cyan]KV Metadata:[/b cyan]  Add @key:value to node text for structured metadata."
    )
    console.print(
        "[b cyan]  --> See all metadata with:[/b cyan] mdbub --kv-list <file.md>.",
        style="dim",
    )
    console.print(
        "[b cyan]Search:[/b cyan]  Press [b]/[/b] to search instantly by text or tag. Navigate results with arrows, Enter to jump."
    )
    console.print(
        "[b cyan]Keyboard-First:[/b cyan]  Navigate, edit, and manage your mindmap without ever leaving the keyboard."
    )
    console.print("")
    console.print(
        "Note: Options like --print-tags and --kv-list must come before the filename."
    )
    console.print("")
    console.print("[yellow]EXAMPLES[/yellow]")
    console.print(
        "mdbub --print-tags FILE.md  |  mdbub --kv-list FILE.md  |  mdbub FILE.md"
    )

    console.print("---", style="dim white")
    console.print(
        "This app was ideated with help from [ChatGPT-4o](https://chatgpt.com/),\n and then vibe coded with a mix of [Claude 4](https://www.anthropic.com/claude) and [GPT-4.1](https://openai.com/blog/gpt-4-1)",
        style="dim white",
    )
    console.print("---", style="dim white")
