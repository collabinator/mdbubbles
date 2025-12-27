package cli

import (
	"fmt"

	"github.com/spf13/cobra"
)

var exportCmd = &cobra.Command{
	Use:   "export [file]",
	Short: "Export mindmap to various formats",
	Long:  "Export mindmap to various formats like HTML, JSON, or plain text.",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		filePath := args[0]
		fmt.Printf("Exporting mindmap from: %s\n", filePath)
		// TODO: Implement export functionality
		fmt.Println("Export functionality not yet implemented in Go version")
	},
}
