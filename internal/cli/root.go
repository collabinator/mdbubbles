package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

const version = "0.5.0"

var rootCmd = &cobra.Command{
	Use:   "mdbub [file]",
	Short: "A mindmap tool for your terminal",
	Long: `mdbub - A mindmap tool for your terminal.
Fast. Fluid. Keyboard-native. Built for thinkers who live in the CLI.

mdbub lets you build and manage mindmaps directly in your terminal.
It's designed for speed-of-thought capture, with streamlined modes for
lightning-fast inline edits and full-screen TUI visual editing.`,
	Version: version,
	Args:    cobra.MaximumNArgs(1), // Accept 0 or 1 file argument
	Run: func(cmd *cobra.Command, args []string) {
		var filePath string
		if len(args) > 0 {
			filePath = args[0]
		}

		if err := runEditor(filePath); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
	},
}

var (
	printTags  bool
	printKV    bool
	printLinks bool
)

func init() {
	rootCmd.Flags().BoolVar(&printTags, "print-tags", false, "Print all #tags in the file as a table and exit")
	rootCmd.Flags().BoolVar(&printKV, "print-kv", false, "Print all @key:value metadata in the file as a table and exit")
	rootCmd.Flags().BoolVar(&printLinks, "print-links", false, "Print all [id:...] anchors in the file as a table and exit")

	// Add subcommands
	rootCmd.AddCommand(aboutCmd)
	rootCmd.AddCommand(exportCmd)
}

// Execute runs the root command
func Execute() error {
	return rootCmd.Execute()
}

func runEditor(filePath string) error {
	if printTags {
		return runPrintTags(filePath)
	}
	if printKV {
		return runPrintKV(filePath)
	}
	if printLinks {
		return runPrintLinks(filePath)
	}

	// TODO: Implement interactive editor
	fmt.Printf("Opening mindmap editor for: %s\n", filePath)
	fmt.Println("Interactive editor not yet implemented in Go version")
	fmt.Println("This is a rewrite from Python to Go - core functionality coming soon!")
	return nil
}

func runPrintTags(filePath string) error {
	if filePath == "" {
		return fmt.Errorf("file path required for --print-tags")
	}
	fmt.Printf("Printing tags from: %s\n", filePath)
	// TODO: Implement tag printing
	return nil
}

func runPrintKV(filePath string) error {
	if filePath == "" {
		return fmt.Errorf("file path required for --print-kv")
	}
	fmt.Printf("Printing key-value metadata from: %s\n", filePath)
	// TODO: Implement KV printing
	return nil
}

func runPrintLinks(filePath string) error {
	if filePath == "" {
		return fmt.Errorf("file path required for --print-links")
	}
	fmt.Printf("Printing links from: %s\n", filePath)
	// TODO: Implement link printing
	return nil
}
